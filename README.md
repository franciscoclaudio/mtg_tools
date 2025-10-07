# **Ferramentas MTG \- Versão 5.0 (Cloud Sync e Multi-Usuário)**

## **🧭 Sumário**

* [🚀 Onde Acessar as Ferramentas](https://www.google.com/search?q=%23onde-acessar-as-ferramentas)  
* [🆕 Deck Stats Tracker (V3) \- Novidades e Recursos Principais](https://www.google.com/search?q=%23deck-stats-tracker-v3---novidades-e-recursos-principais)  
  * [1\. Sincronização em Nuvem (Firebase)](https://www.google.com/search?q=%231-sincronizacao-em-nuvem-firebase)  
  * [2\. Multi-Usuário e Multi-Formato](https://www.google.com/search?q=%232-multi-usuario-e-multi-formato)  
  * [3\. Rastreamento Multi-Deck Completo](https://www.google.com/search?q=%233-rastreamento-multi-deck-completo)  
  * [4\. Gestão de Dados](https://www.google.com/search?q=%234-gestao-de-dados)  
* [📝 Guia Rápido do Tracker (V3)](https://www.google.com/search?q=%23guia-rapido-do-tracker-v3)  
* [💾 Estrutura de Arquivos](https://www.google.com/search?q=%23estrutura-de-arquivos)

Este repositório contém uma suíte de ferramentas para jogadores de Magic: The Gathering, focado em rastreamento de partidas e análise estatística.

## **🚀 Onde Acessar as Ferramentas**

| Ferramenta | Link de Acesso | Descrição |
| :---- | :---- | :---- |
| **Menu Principal** | [Acessar Menu](https://franciscoclaudio.github.io/mtg_tools/Ferramentas_MTG.html) | Menu para navegação fácil entre as ferramentas. |
| **Deck Stats Tracker (V3)** | [Acessar Deck Tracker](https://franciscoclaudio.github.io/mtg_tools/Deck_Tracker_V3.html) | Rastreamento de partidas com sincronização em nuvem, multi-usuário e multi-formato. |
| **Calculadora Hipergeométrica** | [Acessar Calculadora](https://franciscoclaudio.github.io/mtg_tools/calculadora_mtg.html) | Calcula a probabilidade de abertura de mãos (cálculo de "outs"). |

## **🆕 Deck Stats Tracker (V3) \- Novidades e Recursos Principais**

A versão **V3** do Deck Tracker representa a maior atualização da ferramenta, introduzindo sincronização na nuvem e suporte a múltiplos usuários e formatos.

### **1\. Sincronização em Nuvem (Firebase)**

* **Dados Persistentes:** Suas estatísticas e histórico de partidas são salvos e carregados automaticamente via **Firebase Realtime Database**.  
* **Acesso de Qualquer Lugar:** Acesse seus dados em qualquer dispositivo sem precisar de importação manual.

### **2\. Multi-Usuário e Multi-Formato**

* **Seleção de Usuário:** Ao abrir o Tracker, selecione ou registre seu nome de usuário (ex: Chico, Capi, Maciel). Seus dados são isolados e salvos em seu perfil.  
* **Seleção de Formato:** Crie e gerencie decks em diferentes formatos (Modern, Pioneer, Legacy, Standard, Pauper), com listas de metagame pré-definidas para o oponente.

### **3\. Rastreamento Multi-Deck Completo**

* **Estatísticas por Deck:** Crie e acompanhe o Win Rate (por Match e por Game), além do detalhamento de Win Rate por Game 1, Game 2 e Game 3 para **cada deck** que você joga.  
* **Estatísticas por Matchup:** Filtre as estatísticas para ver seu desempenho exato contra decks específicos (ex: Amulet Titan vs. Murktide Regent).

### **4\. Gestão de Dados**

* **Exportar Dados:** Baixe um arquivo JSON com todos os seus dados (de todos os formatos e decks) a qualquer momento.  
* **Importar Dados:** Adicione dados de amigos ou reimporte backups. O sistema é capaz de **migrar automaticamente** a estrutura antiga de decks para a nova estrutura de formatos.

## **📝 Guia Rápido do Tracker (V3)**

1. **Selecione o Usuário:** Use o dropdown "Selecione o Usuário" para carregar seus dados ou a opção **"--- Novo Usuário \---"** para se registrar na nuvem.  
2. **Selecione o Formato:** Escolha o formato que deseja jogar (ex: Modern).  
3. **Selecione/Crie o Deck:**  
   * Escolha um deck existente na lista ou use a opção **"--- Criar Novo Deck \---"** para registrar um novo deck naquele formato.  
   * Após a criação, o novo deck será automaticamente selecionado.  
4. **Registre a Partida:**  
   * Selecione o **Deck Oponente**. Use **"--- Nova Matchup (Manual) \---"** se não estiver na lista do Metagame.  
   * Registre os resultados de G1, G2 e G3.  
   * Clique em **"Registrar Partida"**.  
5. **Visualize Estatísticas:** Use o seletor **"Estatísticas por Matchup"** para analisar o desempenho contra decks específicos.

## **💾 Estrutura de Arquivos**

mtg\_tools/  
├── Ferramentas\_MTG.html          \# Menu principal  
├── Deck\_Tracker\_V3.html          \# Tracker Multi-Usuário/Formato (Cloud Sync)  
├── Deck\_Tracker\_V1.html          \# Versão Antiga (Ex-Amulet Tracker 4.0)  
├── calculadora\_mtg.html          \# Calculadora hipergeométrica  
└── img/                          \# Imagens de fundo
