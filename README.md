# Ferramentas MTG - Multi-Deck Feature Branch

Este é um branch de desenvolvimento que adiciona suporte para rastreamento de múltiplos decks no Match Tracker.

## 🆕 Novidades Nesta Versão

### Multi-Deck Match Tracker
Agora você pode rastrear estatísticas para múltiplos decks simultaneamente, não apenas Amulet Titan!

**Principais Recursos:**
- **Múltiplos Decks**: Crie e gerencie estatísticas para quantos decks quiser
- **Dados Separados**: Cada deck mantém suas próprias estatísticas e histórico de partidas
- **Seleção Rápida**: Troque entre decks facilmente para ver estatísticas específicas
- **Importação/Exportação**: Sistema melhorado que mantém os dados de todos os decks
- **Retrocompatibilidade**: Importa dados antigos do Amulet Titan Tracker automaticamente

## 📁 Estrutura de Arquivos

```
mtg_tools/
├── Ferramentas_MTG.html          # Menu principal
├── Multi_Deck_Tracker.html       # 🆕 Novo tracker multi-deck
├── Amulet_tracker_4.0.html       # Tracker original (mantido)
├── calculadora_mtg.html          # Calculadora hipergeométrica
└── img/                          # Imagens de fundo
```

## 🚀 Como Usar o Multi-Deck Tracker

### 1. Criar um Novo Deck
- Abra `Multi_Deck_Tracker.html`
- No seletor "Selecione seu Deck Atual", escolha "--- Criar Novo Deck ---"
- Digite o nome do deck (ex: "Murktide Regent", "Yawgmoth")
- Clique em "Criar Deck"

### 2. Registrar Partidas
- Selecione o deck que você está jogando no topo da página
- Escolha o deck oponente
- Registre os resultados de G1, G2 e G3
- Clique em "Registrar Partida"

### 3. Visualizar Estatísticas
- As estatísticas gerais mostram o desempenho do deck atualmente selecionado
- Use o seletor "Estatísticas por Matchup" para ver como você se sai contra decks específicos
- Troque de deck no topo para ver estatísticas de outros decks

### 4. Compartilhar Dados com Amigos
- **Exportar**: Clique em "Exportar Dados" para baixar um arquivo `.txt` com todos os seus decks
- **Importar**: Clique em "Importar Dados" para adicionar dados de amigos aos seus

## 💾 Formato dos Dados

Os dados agora são estruturados por deck:

```json
{
  "Amulet Titan": [
    {
      "timestamp": "2025-01-15T10:30:00.000Z",
      "deckProprio": "Amulet Titan",
      "deckOponente": "Boros Energy",
      "g1Result": "win",
      "g2Result": "loss",
      "g3Result": "win"
    }
  ],
  "Murktide Regent": [
    {
      "timestamp": "2025-01-15T14:20:00.000Z",
      "deckProprio": "Murktide Regent",
      "deckOponente": "Living End",
      "g1Result": "win",
      "g2Result": "win",
      "g3Result": "not_played"
    }
  ]
}
```

## 🔄 Migração de Dados Antigos

Se você já usa o Amulet Titan Tracker:

1. Abra o tracker antigo (`Amulet_tracker_4.0.html`)
2. Exporte seus dados
3. Abra o novo Multi-Deck Tracker
4. Importe o arquivo exportado
5. Os dados serão automaticamente organizados sob "Amulet Titan"

## 🧪 Status do Branch

**Branch:** `multi-deck-feature`  
**Status:** Em Testes  
**Versão:** 5.0-beta

### Testado ✅
- Criação de múltiplos decks
- Registro de partidas
- Cálculo de estatísticas
- Export/Import de dados
- Compatibilidade com navegadores modernos

### A Fazer 🚧
- [ ] Versão com Firebase (cloud sync)
- [ ] Sistema de autenticação para múltiplos usuários
- [ ] Gráficos de evolução de winrate ao longo do tempo
- [ ] Comparação entre decks
- [ ] Tags/categorias para decks (Tier 1, Tier 2, etc.)

## 🤝 Uso Compartilhado Entre Amigos

### Cenário Atual (Local Storage)
Cada pessoa mantém seus próprios dados. Para compartilhar:
- Exporte seu arquivo periodicamente
- Compartilhe com amigos via WhatsApp/Discord/etc
- Cada um importa o arquivo dos outros
- Os dados são mesclados automaticamente

### Próxima Versão (Firebase)
Em desenvolvimento: sincronização em tempo real na nuvem para que todos vejam os dados de todos instantaneamente.

## 🐛 Reportar Problemas

Encontrou um bug? Abra uma issue no GitHub ou entre em contato.

## 📝 Licença

Uso pessoal e comunitário. Mantenha a referência aos autores originais ao modificar.

---

**Desenvolvido para a comunidade de Magic: The Gathering**  
*Branch criado em: Janeiro 2025*
