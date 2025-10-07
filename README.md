# 🎴 Ferramentas MTG - Suíte Completa v5.0

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://franciscoclaudio.github.io/mtg_tools/)

> Conjunto profissional de ferramentas para jogadores competitivos de Magic: The Gathering, com foco em análise estatística, rastreamento de partidas e cálculos de probabilidade.

---

## 🚀 Acesso Rápido

| Ferramenta | Link de Acesso | Descrição |
|------------|---------------|-----------|
| **🏠 Menu Principal** | [Acessar](https://franciscoclaudio.github.io/mtg_tools/Ferramentas_MTG.html) | Hub central para navegação entre ferramentas |
| **📊 Deck Stats Tracker V3** | [Acessar](https://franciscoclaudio.github.io/mtg_tools/Deck_Tracker_V3.html) | Rastreamento avançado com cloud sync |
| **🧮 Calculadora Hipergeométrica** | [Acessar](https://franciscoclaudio.github.io/mtg_tools/Calculadora_MTG.html) | Probabilidades de abertura de mão |

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Deck Stats Tracker V3](#-deck-stats-tracker-v3)
  - [Novidades da V3](#novidades-da-v3)
  - [Recursos Principais](#recursos-principais)
  - [Guia de Uso](#guia-de-uso-rápido)
- [Calculadora Hipergeométrica](#-calculadora-hipergeométrica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação Local](#-instalação-local)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Visão Geral

As **Ferramentas MTG** são um conjunto de aplicações web projetadas para auxiliar jogadores de Magic: The Gathering em:

✅ **Análise de Desempenho**: Rastreie win rates por deck, matchup e games individuais  
✅ **Decisões Informadas**: Calcule probabilidades de draws para otimizar sequências  
✅ **Sincronização Multi-Dispositivo**: Acesse seus dados de qualquer lugar via Firebase  
✅ **Suporte Multi-Formato**: Modern, Pioneer, Legacy, Standard e Pauper

---

## 📊 Deck Stats Tracker V3

### Novidades da V3

A versão 3.0 representa uma reformulação completa do sistema de rastreamento:

#### 🔥 **Principais Atualizações**

1. **☁️ Sincronização em Nuvem (Firebase)**
   - Dados salvos automaticamente em tempo real
   - Acesso de qualquer dispositivo sem importação manual
   - Backup automático na nuvem

2. **👥 Sistema Multi-Usuário**
   - Suporte para múltiplos jogadores no mesmo ambiente
   - Perfis isolados e independentes
   - Criação rápida de novos usuários

3. **🎮 Multi-Formato Completo**
   - Organize decks por formato (Modern, Pioneer, Legacy, etc.)
   - Metagames específicos pré-carregados para cada formato
   - Estatísticas separadas por formato

4. **📈 Rastreamento Multi-Deck**
   - Acompanhe quantos decks quiser simultaneamente
   - Estatísticas individuais por deck
   - Comparação de desempenho entre diferentes arquétipos

### Recursos Principais

#### Estatísticas Detalhadas

- **Win Rate Global**: Por matches (2-0, 2-1, etc.)
- **Win Rate por Game**: Performance total em todos os games
- **Win Rate Segmentado**: G1 pré-side, G2 e G3 pós-side
- **Análise por Matchup**: Veja seu desempenho contra decks específicos

#### Gestão de Dados

- **Exportação JSON**: Baixe backup completo dos seus dados
- **Importação Inteligente**: 
  - Suporta estrutura antiga (migração automática)
  - Suporta estrutura nova (multi-formato)
  - Adiciona dados sem sobrescrever existentes

#### Interface Intuitiva

- **Seletores Visuais Destacados**:
  - 🟤 **Usuário**: Fundo marrom escuro com borda branca
  - 🟫 **Formato**: Fundo marrom médio com borda terracota
  - 🟢 **Deck**: Fundo verde com borda dourada
- **Feedback em Tempo Real**: Status de sincronização visível
- **Tema Consistente**: Cores inspiradas em cartas icônicas (Amulet of Vigor, Primeval Titan)

### Guia de Uso Rápido

#### 1️⃣ **Primeiro Acesso**

```
1. Acesse o Deck Stats Tracker
2. Selecione seu nome no dropdown "Selecione o Usuário"
   → Ou clique em "--- Novo Usuário ---" para se registrar
3. Aguarde o carregamento dos dados do Firebase
```

#### 2️⃣ **Configuração Inicial**

```
1. Selecione o FORMATO que deseja jogar (ex: Modern)
2. Selecione seu DECK ATUAL
   → Use "--- Criar Novo Deck ---" se necessário
3. Pronto! O sistema está configurado
```

#### 3️⃣ **Registrando uma Partida**

```
1. Selecione o deck do OPONENTE
   → Lista pré-carregada do metagame do formato
   → Use "--- Nova Matchup (Manual) ---" para decks fora da lista
2. Registre os resultados:
   - Game 1: Vitória/Derrota
   - Game 2: Vitória/Derrota
   - Game 3: Não Jogou / Vitória / Derrota
3. Clique em "Registrar Partida"
4. ✅ Dados salvos automaticamente no Firebase!
```

#### 4️⃣ **Analisando Estatísticas**

```
📊 Estatísticas Gerais:
- Visão macro do desempenho do deck selecionado
- Win rates totais e por game

🎯 Estatísticas por Matchup:
- Dropdown "Selecione um Matchup para ver as Stats"
- Veja seu desempenho específico contra cada arquétipo
- Identifique seus melhores e piores matchups
```

#### 5️⃣ **Backup e Migração**

```
💾 Exportar:
- Clique em "Exportar Dados"
- Baixa arquivo JSON com TODOS os seus dados (todos formatos e decks)

📥 Importar:
- Clique em "Importar Dados"
- Selecione arquivo JSON
- Sistema migra automaticamente estruturas antigas
- Dados são ADICIONADOS aos existentes (não sobrescreve)
```

---

## 🧮 Calculadora Hipergeométrica

### Para que serve?

Calcula a probabilidade de você comprar um número específico de "outs" (cartas desejadas) em uma determinada quantidade de draws.

### Casos de Uso

✅ **Abertura de Mão**: "Qual a chance de ter pelo menos 1 Amulet of Vigor na mão inicial?"  
✅ **Sequência de Jogo**: "Até o turno 4, qual a chance de ter visto 2+ terrenos bounce?"  
✅ **Sideboard**: "Quantas cópias preciso para ter 80%+ de ver pelo menos 1?"

### Como Usar

```
1. Cartas no deck: 60 (ou 99 para Commander)
2. Quantos draws: 7 (mão inicial) ou mais (com mulligans/draws)
3. Quantos Outs: Número de cópias no deck
4. Sucessos necessários: Quantos você PRECISA ver (mínimo)
5. Clique em "Calcular"
```

### Resultados

- **Pelo Menos N Outs**: Probabilidade de ver N ou mais cópias
- **Exatamente N Outs**: Probabilidade de ver exatamente N cópias

---

## 📁 Estrutura do Projeto

```
mtg_tools/
│
├── 📄 Ferramentas_MTG.html          # Menu principal de navegação
├── 📄 Deck_Tracker_V3.html          # Tracker multi-usuário/formato
├── 📄 Calculadora_mtg.html          # Calculadora hipergeométrica
├── 📄 README.md                     # Documentação (este arquivo)
│
├── 📂 styles/                       # Arquivos CSS
│   ├── Ferramentas_MTG_styles.css   # Estilos do menu
│   ├── Deck_Tracker_styles.css      # Estilos do tracker
│   └── Calculadora_MTG_styles.css   # Estilos da calculadora
│
└── 📂 img/                          # Imagens de fundo
    ├── amulet_of_vigor.jpg          # Header do Amulet Tracker
    ├── tireless_tracker.jpg         # Header do Deck Tracker V3
    ├── laboratory_manic.jpg         # Fundo de estatísticas
    ├── solve_equation.jpg           # Header da calculadora
    ├── eureka.jpg                   # Fundo de resultados
    └── dissection_tools.jpg         # Header do menu principal
```

---

## 💻 Instalação Local

### Opção 1: Uso Direto (Recomendado)

Simplesmente acesse via GitHub Pages - não requer instalação!

### Opção 2: Clone Local

```bash
# Clone o repositório
git clone https://github.com/franciscoclaudio/mtg_tools.git

# Entre na pasta
cd mtg_tools

# Abra o arquivo principal no navegador
# Windows
start Ferramentas_MTG.html

# macOS
open Ferramentas_MTG.html

# Linux
xdg-open Ferramentas_MTG.html
```

### Opção 3: Servidor Local

```bash
# Python 3
python -m http.server 8000

# Acesse: http://localhost:8000/Ferramentas_MTG.html
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso | Versão |
|------------|-----|--------|
| **HTML5** | Estrutura das páginas | - |
| **CSS3** | Estilização e layout | - |
| **JavaScript (Vanilla)** | Lógica e interatividade | ES6+ |
| **Firebase Realtime Database** | Sincronização de dados | 9.6.1 |
| **GitHub Pages** | Hospedagem estática | - |

### Por que essas tecnologias?

✅ **Sem frameworks**: Carregamento rápido, sem dependências pesadas  
✅ **Firebase**: Sincronização em tempo real sem backend próprio  
✅ **GitHub Pages**: Hospedagem gratuita, confiável e com HTTPS  
✅ **Vanilla JS**: Máxima compatibilidade e performance

---

## 🗺️ Roadmap

### 🚧 Em Desenvolvimento

- [ ] **Gráficos de Evolução**: Visualize seu win rate ao longo do tempo
- [ ] **Notas por Partida**: Adicione comentários sobre matchups específicos
- [ ] **Comparação de Decks**: Compare estatísticas entre diferentes builds
- [ ] **PWA (Progressive Web App)**: Instale como app no celular

### 💡 Ideias Futuras

- [ ] Sistema de Tags para Partidas (FNM, Torneio, Casual)
- [ ] Análise de Sideboard (tracking de cartas trocadas)
- [ ] Integração com MTG Goldfish/MTGTop8 para metagame atualizado
- [ ] Modo Offline com sincronização posterior
- [ ] Exportação para Excel/Google Sheets

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas etapas:

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade X'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um **Pull Request**

### Diretrizes

- Mantenha o código limpo e comentado
- Teste em múltiplos navegadores
- Siga a paleta de cores do projeto (#27883d, #a87e50, #3a2e22)
- Atualize a documentação conforme necessário

---

## 📜 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Francisco Claudio**

- GitHub: [@franciscoclaudio](https://github.com/franciscoclaudio)
- Projeto: [MTG Tools](https://franciscoclaudio.github.io/mtg_tools/)

---

## 🙏 Agradecimentos

- Comunidade de Magic: The Gathering
- Firebase pela infraestrutura de backend gratuita
- GitHub Pages pela hospedagem
- Todos os playtesters e contribuidores

---

## ⚠️ Disclaimer

Este projeto não é afiliado, endossado ou patrocinado pela Wizards of the Coast LLC. Magic: The Gathering é uma marca registrada da Wizards of the Coast LLC.

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**

[⬆ Voltar ao topo](#-ferramentas-mtg---suíte-completa-v50)

</div>
