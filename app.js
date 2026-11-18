// ==========================================
// SERVICE WORKER
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW erro:', err));
    });
}

// ==========================================
// CONSTANTES GLOBAIS
// ==========================================
const NOVO_USUARIO_OPCAO = 'NOVO_USUARIO';
const NOVO_DECK_OPCAO = 'NOVO_DECK';
const NOVA_MATCHUP_OPCAO = 'NOVA_MATCHUP';

const EXTRA_FORMATS = [
    'Standard', 'Modern', 'Pioneer', 'Pauper', 'Legacy', 'Premodern',
    'Commander', 'Vintage', 'Explorer', 'Alchemy', 'Brawl', 'Draft', 'Sealed', 'Outros'
];

let METAGAME_DECKS_BY_FORMAT = {};

async function loadMetagame() {
    try {
        const res = await fetch('metagame_decks_by_format.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        METAGAME_DECKS_BY_FORMAT = await res.json();
        console.log("Metagame carregado com sucesso:", METAGAME_DECKS_BY_FORMAT);
    } catch (err) {
        console.error('Falha CRÍTICA ao carregar metagame JSON:', err);
        METAGAME_DECKS_BY_FORMAT = {};
    }
}

// ==========================================
// FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDXVYDMwvnUoCUMTlvh8egzqS06_o497y8",
    authDomain: "mtg-tracker-ea7a2.firebaseapp.com",
    databaseURL: "https://mtg-tracker-ea7a2-default-rtdb.firebaseio.com",
    projectId: "mtg-tracker-ea7a2",
    storageBucket: "mtg-tracker-ea7a2.firebasestorage.app",
    messagingSenderId: "365839696243",
    appId: "1:365839696243:web:72d8c6b1d4acafbc7c506",
    measurementId: "G-029H8PTYRH"
};

let firebaseApp = null;
let dbRef = null;
let allData = {};
let globalUsersData = {};
let globalUsersListenerAttached = false;

let currentUser = localStorage.getItem('lastUser') || null;
let currentFormat = localStorage.getItem('lastFormat') || null;
let currentDeck = localStorage.getItem('lastDeck') || null;

let gameResults = { 1: null, 2: null, 3: 'not_played' };

// Elementos DOM
let userSelect, currentFormatSelect, currentDeckSelect, deckOponenteSelect,
    statusElement, fabBtn;

function cacheDom() {
    userSelect = document.getElementById('user-select');
    currentFormatSelect = document.getElementById('current-format-select');
    currentDeckSelect = document.getElementById('current-deck-select');
    deckOponenteSelect = document.getElementById('deck-oponente-select');
    statusElement = document.getElementById('tracker-status');
    fabBtn = document.getElementById('fab-new-match');
}

// ==========================================
// NAV & SHEETS
// ==========================================
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}

function openSheet(sheetId) {
    closeAllSheets();
    document.getElementById('sheet-backdrop').classList.add('active');
    document.getElementById(sheetId).classList.add('open');
}

function closeAllSheets() {
    document.getElementById('sheet-backdrop').classList.remove('active');
    document.querySelectorAll('.bottom-sheet').forEach(el => el.classList.remove('open'));
}

async function openMatchModal() {
    if (!currentDeck || !currentFormat) {
        openSheet('sheet-context');
        return;
    }

    if (Object.keys(METAGAME_DECKS_BY_FORMAT).length === 0) {
        await loadMetagame();
    }

    gameResults = { 1: null, 2: null, 3: 'not_played' };
    document.querySelectorAll('#g1-group .seg-btn, #g2-group .seg-btn')
        .forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#g3-group .seg-btn')
        .forEach(b => b.classList.remove('active'));
    document.querySelector('#g3-group .seg-btn[data-val="not_played"]')
        .classList.add('active');

    // AGUARDA o carregamento do dropdown antes de abrir a gaveta
    await popularOpponentDropdown();
    
    const div = document.getElementById('nova-matchup-container');
    if (deckOponenteSelect.value === NOVA_MATCHUP_OPCAO) {
        div.style.display = 'flex';
    } else {
        div.style.display = 'none';
    }

    openSheet('sheet-match');
}

function selectSeg(groupId, btn) {
    document.querySelectorAll(`#${groupId} .seg-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (groupId === 'play-draw-group') {
        document.getElementById('play-draw-value').value = btn.dataset.val;
    }
}

function selectGame(gameNum, val, btn) {
    document.querySelectorAll(`#g${gameNum}-group .seg-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gameResults[gameNum] = val;

    if ((gameNum === 1 || gameNum === 2) && gameResults[1] && gameResults[2]) {
        if (gameResults[1] === gameResults[2]) {
            gameResults[3] = 'not_played';
            document.querySelectorAll('#g3-group .seg-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('#g3-group .seg-btn[data-val="not_played"]').classList.add('active');
        }
    }
}

// ==========================================
// STATUS / HEADER
// ==========================================
function setStatus(msg, type = 'info') {
    statusElement.textContent = msg;
    statusElement.className = `status-pill ${type}`;
}

function updateHeaderContext() {
    const label = document.getElementById('header-context-text');
    if (currentUser && currentFormat && currentDeck) {
        label.textContent = `${currentUser} • ${currentFormat} • ${currentDeck}`;
    } else if (currentUser && currentFormat) {
        label.textContent = `${currentUser} • ${currentFormat} • Escolher Deck`;
    } else if (currentUser) {
        label.textContent = `${currentUser} • Escolher Formato`;
    } else {
        label.textContent = 'Selecionar Usuário / Deck';
    }
}

// ==========================================
// FIREBASE INIT
// ==========================================
function initializeFirebase() {
    try {
        if (!firebaseApp) firebaseApp = firebase.initializeApp(firebaseConfig);
        attachGlobalUsersListener();
        setStatus('Conectado. Toque no topo para selecionar seu deck.', 'success');
    } catch (e) {
        setStatus(`Erro Firebase: ${e.message}`, 'error');
    }
}

function attachGlobalUsersListener() {
    if (globalUsersListenerAttached || !firebaseApp) return;
    globalUsersListenerAttached = true;
    firebaseApp.database().ref('users').on('value', (snapshot) => {
        globalUsersData = snapshot.val() || {};
        if (currentFormat) popularDeckSelector();
    });
}

async function loadAllUsers() {
    try {
        const snapshot = await firebaseApp.database().ref('users').once('value');
        return Object.keys(snapshot.val() || {});
    } catch { return []; }
}

// ==========================================
// DADOS: decks / oponentes / formatos
// ==========================================
function getGlobalDecksForFormat(format) {
    if (!format) return [];
    const allDecks = new Set();
    Object.values(globalUsersData).forEach(userData => {
        const decksNode = userData?.[format]?.decks || {};
        Object.entries(decksNode).forEach(([deckName, deckMatches]) => {
            allDecks.add(deckName);
            Object.values(deckMatches || {}).forEach(match => {
                if (match?.deckOponente) allDecks.add(match.deckOponente);
            });
        });
    });
    return Array.from(allDecks);
}

function getAllOpponentsFromDatabase(format) {
    const set = new Set();
    const decks = allData[format]?.decks || {};
    Object.values(decks).forEach(matches => {
        Object.values(matches || {}).forEach(m => {
            if (m?.deckOponente) set.add(m.deckOponente);
        });
    });
    return Array.from(set);
}

function getCurrentDecks(format) {
    return allData[format]?.decks || {};
}

function getLastPlayedTimestamp(deckMatches) {
    let maxTs = 0;
    let hasAny = false;
    Object.values(deckMatches || {}).forEach(m => {
        if (!m) return;
        hasAny = true;
        if (m.timestamp) {
            const t = Date.parse(m.timestamp);
            if (!isNaN(t) && t > maxTs) maxTs = t;
        }
    });
    return hasAny && maxTs === 0 ? 1 : maxTs;
}

function getLastPlayedTimestampForFormat(format) {
    let maxTs = 0;
    const decks = allData[format]?.decks || {};
    Object.values(decks).forEach(matches => {
        Object.values(matches || {}).forEach(m => {
            if (!m?.timestamp) return;
            const t = Date.parse(m.timestamp);
            if (!isNaN(t) && t > maxTs) maxTs = t;
        });
    });
    return maxTs;
}

// ==========================================
// CONSTRUTOR ÚNICO DE OPÇÕES DE DECK
// ==========================================
function buildDeckOptions(format, opts = {}) {
    if (!format) return { playedByUser: [], playedAgainst: [], unplayed: [] };

    const {
        exclude = new Set(),
        includeMeta = true,
        includeGlobal = true,
        includeDb = true
    } = opts;

    const userDecksObj = getCurrentDecks(format);
    const allUserDecks = Object.keys(userDecksObj);

    const metaDecks = includeMeta ? (METAGAME_DECKS_BY_FORMAT[format] || []) : [];
    const globalDecks = includeGlobal ? getGlobalDecksForFormat(format) : [];
    const dbOpponents = includeDb ? getAllOpponentsFromDatabase(format) : [];

    const playedByUserMap = new Map();
    const playedAgainstMap = new Map();

    allUserDecks.forEach(name => {
        if (exclude.has(name)) return;
        const ts = getLastPlayedTimestamp(userDecksObj[name]);
        if (ts > 0) playedByUserMap.set(name, ts);
    });

    Object.values(userDecksObj).forEach(matches => {
        Object.values(matches || {}).forEach(m => {
            if (!m || !m.deckOponente) return;
            const opp = m.deckOponente;
            if (opp === 'OTHER' || opp === 'Outro' || exclude.has(opp)) return;
            let ts = 0;
            if (m.timestamp) {
                const t = Date.parse(m.timestamp);
                if (!isNaN(t)) ts = t;
            }
            const prev = playedAgainstMap.get(opp) || 0;
            if (ts > prev) playedAgainstMap.set(opp, ts);
        });
    });

    playedByUserMap.forEach((_, name) => {
        if (playedAgainstMap.has(name)) playedAgainstMap.delete(name);
    });

    const list1 = Array.from(playedByUserMap.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);
    const list2 = Array.from(playedAgainstMap.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);

    const unplayedSet = new Set();
    [...metaDecks, ...globalDecks, ...dbOpponents, ...allUserDecks].forEach(n => {
        if (!n || n === 'Outro' || n === 'OTHER' || exclude.has(n)) return;
        if (!playedByUserMap.has(n) && !playedAgainstMap.has(n)) unplayedSet.add(n);
    });

    const list3 = Array.from(unplayedSet).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

    return { playedByUser: list1, playedAgainst: list2, unplayed: list3 };
}

// ==========================================
// DECK SELECT (do usuário)
// ==========================================
function popularDeckSelector() {
    if (!currentFormat) return;

    const { playedByUser, playedAgainst, unplayed } = buildDeckOptions(currentFormat, {
        includeMeta: true,
        includeGlobal: false
    });

    currentDeckSelect.innerHTML = '';
    currentDeckSelect.appendChild(new Option('+ Criar Novo Deck', NOVO_DECK_OPCAO));

    if (playedByUser.length) {
        const g = document.createElement('optgroup');
        g.label = 'Seus Decks (Jogados recentemente)';
        playedByUser.forEach(n => g.appendChild(new Option(n, n)));
        currentDeckSelect.appendChild(g);
    }

    if (playedAgainst.length) {
        const g = document.createElement('optgroup');
        g.label = 'Decks que você enfrentou';
        playedAgainst.forEach(n => g.appendChild(new Option(n, n)));
        currentDeckSelect.appendChild(g);
    }

    if (unplayed.length) {
        const g = document.createElement('optgroup');
        g.label = 'Metagame / Outros';
        unplayed.forEach(n => g.appendChild(new Option(n, n)));
        currentDeckSelect.appendChild(g);
    }

    const all = new Set([...playedByUser, ...playedAgainst, ...unplayed]);
    if (currentDeck && all.has(currentDeck)) {
        currentDeckSelect.value = currentDeck;
        document.getElementById('novo-deck-container').style.display = 'none';
    } else {
        currentDeckSelect.value = NOVO_DECK_OPCAO;
        currentDeck = null;
        onDeckChange(NOVO_DECK_OPCAO, false);
    }
    currentDeckSelect.disabled = false;
}

// ==========================================
// OPONENTE SELECT
// ==========================================
async function popularOpponentDropdown() {
    if (!currentFormat || !currentDeck) return;

    // GARANTIA: Se o JSON do metagame não carregou ainda, força o carregamento agora
    if (Object.keys(METAGAME_DECKS_BY_FORMAT).length === 0) {
        await loadMetagame();
    }

    const exclude = new Set([currentDeck]);
    
    // 1. Puxa os dados do histórico
    const { playedByUser, playedAgainst, unplayed } = buildDeckOptions(currentFormat, {
        exclude,
        includeDb: true,
        includeMeta: true,
        includeGlobal: true
    });

    // 2. Puxa o metagame bruto (Lifegain, Mono-Green, etc.) garantidamente
    const rawMeta = METAGAME_DECKS_BY_FORMAT[currentFormat] || [];
    const playedByUserSet = new Set(playedByUser);
    const playedAgainstSet = new Set(playedAgainst);

    // 3. Filtra o deck atual e os já jogados
    const extraUnplayed = rawMeta.filter(n => 
        n !== currentDeck && 
        !playedByUserSet.has(n) && 
        !playedAgainstSet.has(n)
    );

    // 4. Junta e ordena alfabeticamente
    const allUnplayed = Array.from(new Set([...unplayed, ...extraUnplayed]))
        .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

    deckOponenteSelect.innerHTML = '';

    // 1. Opção de Outro Deck
    deckOponenteSelect.appendChild(new Option('+ Outro Deck (Digitar)', NOVA_MATCHUP_OPCAO));

    if (playedByUser.length) {
        const g = document.createElement('optgroup');
        g.label = 'Seus Decks (Jogados recentemente)';
        playedByUser.forEach(n => g.appendChild(new Option(n, n)));
        deckOponenteSelect.appendChild(g);
    }

    if (playedAgainst.length) {
        const g = document.createElement('optgroup');
        g.label = 'Já enfrentados';
        playedAgainst.forEach(n => g.appendChild(new Option(n, n)));
        deckOponenteSelect.appendChild(g);
    }

    if (allUnplayed.length) {
        const g = document.createElement('optgroup');
        g.label = 'Metagame / Outros';
        allUnplayed.forEach(n => g.appendChild(new Option(n, n)));
        deckOponenteSelect.appendChild(g);
    }
    
    deckOponenteSelect.selectedIndex = 0;
}

// ==========================================
// SALVAR CONTEXTO
// ==========================================
function salvarContexto() {
    const deckSelecionado = currentDeckSelect.value;

    if (deckSelecionado === NOVO_DECK_OPCAO) {
        const nomeDeck = document.getElementById('novo-deck-input').value.trim();
        if (!nomeDeck) {
            alert('Digite o nome do novo deck.');
            return;
        }
        if (!dbRef || !currentFormat) return;

        dbRef.child(currentFormat).child('decks').child(nomeDeck).once('value')
            .then(snap => snap.exists() ? null : dbRef.child(currentFormat).child('decks').child(nomeDeck).set({}))
            .then(() => {
                currentDeck = nomeDeck;
                localStorage.setItem('lastDeck', nomeDeck);
                
                document.getElementById('novo-deck-container').style.display = 'none';
                document.getElementById('novo-deck-input').value = '';
                
                popularDeckSelector();
                currentDeckSelect.value = nomeDeck;
                onDeckChange(nomeDeck, false);
                closeAllSheets();
            })
            .catch(err => alert(`Erro ao criar deck: ${err.message}`));
            
    } else if (deckSelecionado) {
        onDeckChange(deckSelecionado, true);
        closeAllSheets();
    } else {
        closeAllSheets();
    }
}

// ==========================================
// FORMATO SELECT
// ==========================================
function popularFormatSelector() {
    currentFormatSelect.innerHTML = '';

    const universe = new Set([
        ...Object.keys(METAGAME_DECKS_BY_FORMAT || {}),
        ...EXTRA_FORMATS,
        ...Object.keys(allData || {})
    ]);

    const playedMap = new Map();
    const unplayed = [];

    universe.forEach(fmt => {
        const ts = getLastPlayedTimestampForFormat(fmt);
        if (ts > 0) playedMap.set(fmt, ts);
        else unplayed.push(fmt);
    });

    const played = Array.from(playedMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([f]) => f);

    unplayed.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

    if (played.length) {
        const g = document.createElement('optgroup');
        g.label = 'Jogados recentemente';
        played.forEach(f => g.appendChild(new Option(f, f)));
        currentFormatSelect.appendChild(g);
    }

    if (unplayed.length) {
        const g = document.createElement('optgroup');
        g.label = 'Outros formatos';
        unplayed.forEach(f => g.appendChild(new Option(f, f)));
        currentFormatSelect.appendChild(g);
    }

    if (currentFormat && universe.has(currentFormat)) {
        currentFormatSelect.value = currentFormat;
    } else {
        currentFormatSelect.value = ''; 
    }
}

// ==========================================
// TROCA DE CONTEXTO
// ==========================================
function onFormatChange(shouldSave = true) {
    currentFormat = currentFormatSelect.value || null;
    if (shouldSave && currentFormat) localStorage.setItem('lastFormat', currentFormat);
    currentDeck = null;
    localStorage.removeItem('lastDeck');

    if (currentFormat) {
        currentDeckSelect.disabled = false;
        popularDeckSelector();
    } else {
        currentDeckSelect.disabled = true;
        currentDeckSelect.innerHTML = '<option value="" disabled selected>Selecione o Formato primeiro</option>';
    }
    updateHeaderContext();
    updateStatsDisplay();
}

function onDeckChange(deckName, shouldSave = true) {
    if (shouldSave && deckName && deckName !== NOVO_DECK_OPCAO) {
        localStorage.setItem('lastDeck', deckName);
    }

    const novoDeckDiv = document.getElementById('novo-deck-container');
    if (!deckName || deckName === '') {
        currentDeck = null;
        novoDeckDiv.style.display = 'none';
        fabBtn.disabled = true;
    } else if (deckName === NOVO_DECK_OPCAO) {
        currentDeck = null;
        novoDeckDiv.style.display = 'flex';
        document.getElementById('novo-deck-input').focus();
        fabBtn.disabled = true;
    } else {
        currentDeck = deckName;
        novoDeckDiv.style.display = 'none';
        fabBtn.disabled = false;
        popularOpponentDropdown(); // Roda em background ao trocar de deck
    }
    updateHeaderContext();
    updateStatsDisplay();
}

function loadUserData(username) {
    if (!firebaseApp || !username) return;
    dbRef = firebaseApp.database().ref(`users/${username}`);
    currentUser = username;
    localStorage.setItem('lastUser', username);

    document.getElementById('export-btn').disabled = false;
    document.getElementById('import-btn').disabled = false;
    setStatus(`Sincronizando ${username}...`, 'info');

    dbRef.on('value', (snapshot) => {
        allData = snapshot.val() || {};
        popularFormatSelector();

        const savedFormat = localStorage.getItem('lastFormat');
        const savedDeck = localStorage.getItem('lastDeck');

        if (savedFormat && (allData[savedFormat] || METAGAME_DECKS_BY_FORMAT[savedFormat])) {
            currentFormatSelect.value = savedFormat;
            currentFormat = savedFormat;
            popularDeckSelector();

            if (savedDeck) {
                currentDeck = savedDeck;
                const all = new Set([...currentDeckSelect.options].map(o => o.value));
                if (all.has(savedDeck)) {
                    currentDeckSelect.value = savedDeck;
                    onDeckChange(savedDeck, false);
                } else {
                    onDeckChange(null, false);
                }
            } else {
                onDeckChange(null, false);
            }
        } else {
            onFormatChange(false);
        }

        currentFormatSelect.disabled = false;
        updateHeaderContext();
    });
}

async function popularUserSelector() {
    userSelect.innerHTML = '<option value="" disabled selected>Selecione seu Nome</option>';
    const users = await loadAllUsers();
    users.forEach(name => userSelect.appendChild(new Option(name, name)));
    userSelect.appendChild(new Option('+ Novo Usuário', NOVO_USUARIO_OPCAO));

    if (currentUser && users.includes(currentUser)) {
        userSelect.value = currentUser;
        loadUserData(currentUser);
    } else {
        openSheet('sheet-context');
    }
}

function setNovoUsuario() {
    const nome = document.getElementById('novo-usuario-input').value.trim();
    if (!nome) return;
    localStorage.setItem('lastUser', nome);
    currentUser = nome;
    document.getElementById('novo-usuario-container').style.display = 'none';
    document.getElementById('novo-usuario-input').value = '';
    popularUserSelector();
    loadUserData(nome);
}

// ==========================================
// ESTATÍSTICAS
// ==========================================
function calculateStats(matchesObj) {
    const matches = Object.values(matchesObj || {});
    let totalMatches = 0, matchesWon = 0, gamesWon = 0;
    let g1Total = 0, g1Won = 0, g2Total = 0, g2Won = 0, g3Total = 0, g3Won = 0;
    let playTotal = 0, playWon = 0, drawTotal = 0, drawWon = 0;

    for (const m of matches) {
        const g1 = (m.g1Result || '').toLowerCase();
        const g2 = (m.g2Result || '').toLowerCase();
        const g3 = (m.g3Result || 'not_played').toLowerCase();
        const pd = (m.playDraw || '').toLowerCase();

        if (g1) { g1Total++; if (g1 === 'win') { g1Won++; gamesWon++; } }
        if (g2) { g2Total++; if (g2 === 'win') { g2Won++; gamesWon++; } }
        if (g3 !== 'not_played' && g3) { g3Total++; if (g3 === 'win') { g3Won++; gamesWon++; } }

        totalMatches++;
        const won = ((g1 === 'win' ? 1 : 0) + (g2 === 'win' ? 1 : 0) + (g3 === 'win' ? 1 : 0)) >= 2;
        if (won) matchesWon++;

        if (pd === 'play') { playTotal++; if (won) playWon++; }
        else if (pd === 'draw') { drawTotal++; if (won) drawWon++; }
    }

    const totalGames = g1Total + g2Total + g3Total;
    const pct = (w, t) => t > 0 ? ((w / t) * 100).toFixed(1) + '%' : '--%';
    const rawPct = (w, t) => t > 0 ? (w / t) * 100 : 0;

    return {
        totalMatches, matchesWon, matchesLost: totalMatches - matchesWon,
        rawMatchWR: rawPct(matchesWon, totalMatches),
        generalWinRate: pct(matchesWon, totalMatches),
        gameWinRate: pct(gamesWon, totalGames),
        g1WinRate: pct(g1Won, g1Total),
        g2WinRate: pct(g2Won, g2Total),
        g3WinRate: pct(g3Won, g3Total),
        playWinRate: pct(playWon, playTotal),
        drawWinRate: pct(drawWon, drawTotal)
    };
}

function updateStatsDisplay() {
    const currentMatches = (currentFormat && currentDeck)
        ? (allData[currentFormat]?.decks?.[currentDeck] || {})
        : {};
    const stats = calculateStats(currentMatches);

    document.getElementById('match-count-geral').textContent = `${stats.totalMatches} partidas`;
    document.getElementById('wr-match-geral').textContent = stats.generalWinRate;
    document.getElementById('wr-match-bar').style.width = `${stats.rawMatchWR}%`;
    document.getElementById('wr-game-geral').textContent = stats.gameWinRate;
    document.getElementById('wr-play-geral').textContent = stats.playWinRate;
    document.getElementById('wr-draw-geral').textContent = stats.drawWinRate;
    document.getElementById('wr-g1-geral').textContent = stats.g1WinRate;
    document.getElementById('wr-g2-geral').textContent = stats.g2WinRate;
    document.getElementById('wr-g3-geral').textContent = stats.g3WinRate;

    if (currentDeck) setStatus(`${currentDeck} (${currentFormat}) sincronizado`, 'success');

    renderMatchupList(currentMatches);
}

function renderMatchupList(currentMatches) {
    const listEl = document.getElementById('matchup-list');
    const matchesArr = Object.values(currentMatches || {});

    if (!currentDeck || matchesArr.length === 0) {
        listEl.innerHTML = `<div class="empty-state">${currentDeck ? 'Nenhuma partida registrada ainda. Toque em "+ Partida".' : 'Selecione um deck no topo para começar.'}</div>`;
        return;
    }

    const grouped = {};
    matchesArr.forEach(m => {
        const opp = m.deckOponente || 'Desconhecido';
        if (!grouped[opp]) grouped[opp] = [];
        grouped[opp].push(m);
    });

    const sortedOpps = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);

    listEl.innerHTML = sortedOpps.map(opp => {
        const st = calculateStats(grouped[opp]);
        const wrClass = st.rawMatchWR >= 55 ? 'text-win' : (st.rawMatchWR <= 45 ? 'text-loss' : 'text-accent');
        return `
            <div class="card matchup-item" onclick="this.classList.toggle('expanded')">
                <div class="mu-summary">
                    <div>
                        <div class="mu-name">${opp}</div>
                        <div class="mu-record">${st.matchesWon}V - ${st.matchesLost}D (${st.totalMatches} jogos)</div>
                    </div>
                    <div class="mu-wr ${wrClass}">${st.generalWinRate}</div>
                </div>
                <div class="mu-details">
                    <div><span>Game WR:</span> <strong>${st.gameWinRate}</strong></div>
                    <div><span>Play / Draw:</span> <strong>${st.playWinRate} / ${st.drawWinRate}</strong></div>
                    <div><span>G1 / G2 / G3:</span> <strong>${st.g1WinRate} / ${st.g2WinRate} / ${st.g3WinRate}</strong></div>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// LISTENERS
// ==========================================
function attachListeners() {
    userSelect.addEventListener('change', (e) => {
        if (e.target.value === NOVO_USUARIO_OPCAO) {
            document.getElementById('novo-usuario-container').style.display = 'flex';
        } else {
            document.getElementById('novo-usuario-container').style.display = 'none';
            loadUserData(e.target.value);
        }
    });

    currentFormatSelect.addEventListener('change', () => onFormatChange(true));

    currentDeckSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        onDeckChange(val, true);
    });
    
    deckOponenteSelect.addEventListener('change', (e) => {
        const div = document.getElementById('nova-matchup-container');
        if (e.target.value === NOVA_MATCHUP_OPCAO) {
            div.style.display = 'flex';
            document.getElementById('nova-matchup-input').focus();
        } else {
            div.style.display = 'none';
        }
    });

    document.getElementById('matchup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let opp = deckOponenteSelect.value;
        if (opp === NOVA_MATCHUP_OPCAO) {
            opp = document.getElementById('nova-matchup-input').value.trim();
        }
        if (!opp || !gameResults[1] || !gameResults[2]) {
            alert('Selecione o oponente e os resultados do Game 1 e Game 2.');
            return;
        }

        const newMatch = {
            timestamp: new Date().toISOString(),
            deckProprio: currentDeck,
            deckOponente: opp,
            playDraw: document.getElementById('play-draw-value').value,
            g1Result: gameResults[1],
            g2Result: gameResults[2],
            g3Result: gameResults[3] || 'not_played'
        };

        dbRef.child(currentFormat).child('decks').child(currentDeck).push(newMatch).then(() => {
            closeAllSheets();
            document.getElementById('nova-matchup-input').value = '';
            document.getElementById('nova-matchup-container').style.display = 'none';
        });
    });

    document.getElementById('file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !dbRef) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                dbRef.set(parsed).then(() => closeAllSheets());
            } catch { alert('JSON inválido.'); }
        };
        reader.readAsText(file);
        e.target.value = null;
    });

    document.getElementById('mtgo-username-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMtgoPlayer();
    });
}

// ==========================================
// EXPORT
// ==========================================
function exportData() {
    if (!currentUser || Object.keys(allData).length === 0) return;
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser}_mtg_tracker.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==========================================
// CALCULADORA HIPERGEOMÉTRICA
// ==========================================
function fat(x) { let s = 0; for (let i = 0; i < x; i++) s += Math.log(x - i); return s; }
function escolhe(x, y) { if (y < 0 || y > x) return -Infinity; return fat(x) - fat(y) - fat(x - y); }
function hypergeometric_log_prob(N, n, K, k) {
    if (n - k > N - K) return -Infinity;
    return escolhe(K, k) + escolhe(N - K, n - k) - escolhe(N, n);
}

function setCalcVal(id, val) {
    const el = document.getElementById(id);
    el.value = Math.max(0, val);
    runCalculations();
}

function stepCalcVal(id, delta) {
    const el = document.getElementById(id);
    const current = parseInt(el.value) || 0;
    el.value = Math.max(0, current + delta);
    runCalculations();
}

function runCalculations() {
    const P = parseInt(document.getElementById('popSize').value);
    const A = parseInt(document.getElementById('sampleSize').value);
    const S = parseInt(document.getElementById('successesInPop').value);
    const N = parseInt(document.getElementById('successesNeeded').value);

    const resAtLeast = document.getElementById('calc-res-atleast');
    const resExact = document.getElementById('calc-res-exact');
    document.getElementById('calc-label-atleast').textContent = `CHANCE DE PELO MENOS ${isNaN(N) ? 0 : N} OUT(S)`;
    document.getElementById('calc-label-exact-n').textContent = isNaN(N) ? 0 : N;

    if (isNaN(P) || isNaN(A) || isNaN(S) || isNaN(N) || P <= 0 || A <= 0 || S < 0 || N < 0 || A > P || S > P) {
        resAtLeast.textContent = 'Inválido';
        resExact.textContent = '--%';
        return;
    }

    let totalLogSum = -Infinity;
    const maxSuccesses = Math.min(A, S);
    const exactLogProbs = new Array(maxSuccesses + 1).fill(-Infinity);

    for (let i = 0; i <= maxSuccesses; i++) {
        const lp = hypergeometric_log_prob(P, A, S, i);
        exactLogProbs[i] = lp;
        if (i >= N) totalLogSum = (totalLogSum === -Infinity) ? lp : totalLogSum + Math.log(1 + Math.exp(lp - totalLogSum));
    }

    const probAtLeast = totalLogSum === -Infinity ? 0 : Math.exp(totalLogSum);
    const probExact = (N <= maxSuccesses && N >= 0 && exactLogProbs[N] !== -Infinity) ? Math.exp(exactLogProbs[N]) : 0;

    resAtLeast.textContent = `${(100 * probAtLeast).toFixed(2)}%`;
    resExact.textContent = `${(100 * probExact).toFixed(2)}%`;
}

// ==========================================
// MTGO
// ==========================================
const MTGO_HISTORY_KEY = 'mtgo_recent_players';
function getMtgoHistory() {
    try { return JSON.parse(localStorage.getItem(MTGO_HISTORY_KEY)) || ['claudio0907', 'kingcapivara']; }
    catch { return ['claudio0907', 'kingcapivara']; }
}
function saveMtgoHistory(username) {
    let list = getMtgoHistory().filter(u => u.toLowerCase() !== username.toLowerCase());
    list.unshift(username);
    list = list.slice(0, 8);
    localStorage.setItem(MTGO_HISTORY_KEY, JSON.stringify(list));
    renderMtgoHistory();
}
function clearMtgoHistory() {
    localStorage.setItem(MTGO_HISTORY_KEY, JSON.stringify([]));
    renderMtgoHistory();
}
function renderMtgoHistory() {
    const container = document.getElementById('mtgo-history-chips');
    const list = getMtgoHistory();
    if (list.length === 0) {
        container.innerHTML = '<span class="helper-text">Nenhuma busca recente.</span>';
        return;
    }
    container.innerHTML = list.map(user => `
        <button type="button" class="history-chip" onclick="searchMtgoPlayer('${user}')">
            🏆 ${user}
        </button>
    `).join('');
}
function searchMtgoPlayer(presetUser = null) {
    const input = document.getElementById('mtgo-username-input');
    const username = (presetUser || input.value).trim();
    if (!username) return;
    input.value = username;
    saveMtgoHistory(username);
    window.open(`https://www.mtggoldfish.com/player/${encodeURIComponent(username)}`, '_blank');
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    cacheDom();
    attachListeners();
    await loadMetagame();
    initializeFirebase();
    popularUserSelector();
    runCalculations();
    renderMtgoHistory();
});
