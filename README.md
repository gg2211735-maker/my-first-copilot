# 🏁 Mario Kart JS — Simulador de Corrida

> Projeto prático desenvolvido durante a **Formação Node.js da DIO (Digital Innovation One)**
> Versão melhorada do desafio original com novos personagens, novo bloco de pista e sistema de itens!

---

## 🎮 Sobre o Projeto

Simulação de uma corrida de Mario Kart no terminal usando **Node.js puro**, sem dependências externas.

Dois personagens são sorteados aleatoriamente e competem por **7 rodadas**, onde cada rodada sorteia um bloco de pista diferente. Quem acumular mais pontos ao final vence!

---

## ✨ Melhorias em relação ao projeto original

| Feature | Original | Esta versão |
|---|---|---|
| Nº de personagens | 6 | **8** (+Toad e Wario) |
| Rodadas por corrida | 5 | **7** |
| Tipos de bloco | 3 | **4** (+Bloco de ITEM) |
| Sistema de itens | ❌ | ✅ Casca, Cogumelo, Concha, Estrela, Bomba |
| Interface visual | Simples | **Bordas ASCII estilizadas** |

---

## 🧑‍🤝‍🧑 Personagens

| Personagem | Emoji | ⚡ Vel | 🎮 Man | 💪 Poder |
|---|---|---|---|---|
| Mario | 🔴 | 4 | 3 | 3 |
| Peach | 👸 | 3 | 4 | 2 |
| Yoshi | 🦕 | 2 | 4 | 3 |
| Bowser | 🐢 | 5 | 2 | 5 |
| Luigi | 🟢 | 3 | 4 | 4 |
| Donkey Kong | 🦍 | 2 | 2 | 5 |
| Toad *(novo)* | 🍄 | 5 | 5 | 1 |
| Wario *(novo)* | 💛 | 3 | 2 | 5 |

---

## 🛣️ Blocos da Pista

| Bloco | Como funciona |
|---|---|
| 🏎️ **RETA** | Dado (1-6) + Velocidade. Maior total ganha 1 ponto |
| 🔄 **CURVA** | Dado (1-6) + Manobrabilidade. Maior total ganha 1 ponto |
| ⚔️ **CONFRONTO** | Dado (1-6) + Poder. Quem perde, perde 1 ponto (mín. 0) |
| 🎁 **ITEM** *(novo)* | Cada jogador recebe um item aleatório com efeitos variados |

### 🎁 Itens disponíveis

- 🍌 **Casca de Banana** — Adversário perde 1 ponto
- 🍄 **Cogumelo Turbo** — Você ganha 1 ponto
- 🔴 **Concha Vermelha** — Adversário perde 1 ponto
- ⭐ **Estrela Dourada** — Você ganha 2 pontos
- 💣 **Bomba** — Nada acontece!

---

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

### Instalação e execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/mario-kart-js.git

# Entre na pasta
cd mario-kart-js

# Rode o simulador
npm start
```

Ou diretamente:

```bash
node src/index.js
```

---

## 📁 Estrutura do projeto

```
mario-kart-js/
├── src/
│   └── index.js       # Lógica principal do jogo
├── package.json       # Metadados do projeto
└── README.md          # Este arquivo
```

---

## 🧠 Conceitos praticados

- **JavaScript moderno** (ES6+): `const`, arrow functions, template literals, destructuring
- **Programação assíncrona**: `async/await`, `Promise`, `setTimeout`
- **Estruturas de dados**: objetos, arrays, métodos de array
- **Lógica de jogo**: dados, pontuação, condições de vitória
- **Node.js puro**: sem frameworks, sem dependências

---

## 🔗 Referências

- [Repositório original - DIO](https://github.com/digitalinnovationone/formacao-nodejs/tree/main/03-projeto-mario-kart)
- [Formação Node.js - DIO](https://web.dio.me)
- [Documentação Node.js](https://nodejs.org/docs)

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

<p align="center">
  Feito com ❤️ durante a Formação Node.js da DIO 🚀
</p>
