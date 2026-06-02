// 🏁 Mario Kart JS - Simulador de Corrida
// Projeto DIO - Formação Node.js

const characters = {
  mario: {
    name: "Mario",
    emoji: "🔴",
    velocidade: 4,
    manobrabilidade: 3,
    poder: 3,
  },
  peach: {
    name: "Peach",
    emoji: "👸",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 2,
  },
  yoshi: {
    name: "Yoshi",
    emoji: "🦕",
    velocidade: 2,
    manobrabilidade: 4,
    poder: 3,
  },
  bowser: {
    name: "Bowser",
    emoji: "🐢",
    velocidade: 5,
    manobrabilidade: 2,
    poder: 5,
  },
  luigi: {
    name: "Luigi",
    emoji: "🟢",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 4,
  },
  donkeykong: {
    name: "Donkey Kong",
    emoji: "🦍",
    velocidade: 2,
    manobrabilidade: 2,
    poder: 5,
  },
  toad: {
    name: "Toad",
    emoji: "🍄",
    velocidade: 5,
    manobrabilidade: 5,
    poder: 1,
  },
  wario: {
    name: "Wario",
    emoji: "💛",
    velocidade: 3,
    manobrabilidade: 2,
    poder: 5,
  },
};

const TRACK_BLOCKS = ["RETA", "CURVA", "CONFRONTO", "ITEM"];
const TOTAL_ROUNDS = 7;

const ITEMS = [
  { nome: "Casca de Banana 🍌", efeito: "perde_ponto_adversario" },
  { nome: "Cogumelo Turbo 🍄", efeito: "ganha_ponto" },
  { nome: "Concha Vermelha 🔴", efeito: "perde_ponto_adversario" },
  { nome: "Estrela Dourada ⭐", efeito: "ganha_dois_pontos" },
  { nome: "Bomba 💣", efeito: "nada" },
];

function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

function getRandomBlock() {
  return TRACK_BLOCKS[Math.floor(Math.random() * TRACK_BLOCKS.length)];
}

function getRandomItem() {
  return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

function getRandomCharacters() {
  const keys = Object.keys(characters);
  const shuffled = keys.sort(() => Math.random() - 0.5);
  return [characters[shuffled[0]], characters[shuffled[1]]];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function printHeader() {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║         🏁  MARIO KART JS - SIMULADOR  🏁            ║");
  console.log("║              Projeto DIO | Node.js                   ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log("\n");
  await sleep(500);
}

async function printCharacterStats(char) {
  console.log(
    `  ${char.emoji} ${char.name.padEnd(12)} | ⚡ Vel: ${char.velocidade} | 🎮 Man: ${char.manobrabilidade} | 💪 Poder: ${char.poder}`
  );
}

async function printRoundResult(round, block, p1, p2, result) {
  const blockEmoji = {
    RETA: "🏎️  RETA",
    CURVA: "🔄 CURVA",
    CONFRONTO: "⚔️  CONFRONTO",
    ITEM: "🎁 ITEM",
  };

  console.log(`\n┌─ Rodada ${round}/${TOTAL_ROUNDS} ─ ${blockEmoji[block]} ─────────────────────────┐`);
  console.log(result);
  console.log(
    `│ Placar: ${p1.name} ${p1.emoji} [${p1.pontos}] vs [${p2.pontos}] ${p2.emoji} ${p2.name}`.padEnd(55) + "│"
  );
  console.log("└──────────────────────────────────────────────────────┘");
  await sleep(800);
}

async function runRace(player1, player2) {
  player1.pontos = 0;
  player2.pontos = 0;

  console.log("\n🏁 Largada! A corrida vai começar...\n");
  await sleep(1000);

  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    const block = getRandomBlock();
    let resultLines = [];

    if (block === "RETA") {
      const dice1 = rollDice();
      const dice2 = rollDice();
      const total1 = dice1 + player1.velocidade;
      const total2 = dice2 + player2.velocidade;

      resultLines.push(
        `│ ${player1.emoji} ${player1.name}: 🎲 ${dice1} + ⚡${player1.velocidade} = ${total1}`
      );
      resultLines.push(
        `│ ${player2.emoji} ${player2.name}: 🎲 ${dice2} + ⚡${player2.velocidade} = ${total2}`
      );

      if (total1 > total2) {
        player1.pontos++;
        resultLines.push(`│ ✅ ${player1.name} vence a reta! +1 ponto`);
      } else if (total2 > total1) {
        player2.pontos++;
        resultLines.push(`│ ✅ ${player2.name} vence a reta! +1 ponto`);
      } else {
        resultLines.push(`│ 🤝 Empate na reta! Ninguém pontua.`);
      }
    } else if (block === "CURVA") {
      const dice1 = rollDice();
      const dice2 = rollDice();
      const total1 = dice1 + player1.manobrabilidade;
      const total2 = dice2 + player2.manobrabilidade;

      resultLines.push(
        `│ ${player1.emoji} ${player1.name}: 🎲 ${dice1} + 🎮${player1.manobrabilidade} = ${total1}`
      );
      resultLines.push(
        `│ ${player2.emoji} ${player2.name}: 🎲 ${dice2} + 🎮${player2.manobrabilidade} = ${total2}`
      );

      if (total1 > total2) {
        player1.pontos++;
        resultLines.push(`│ ✅ ${player1.name} faz a curva melhor! +1 ponto`);
      } else if (total2 > total1) {
        player2.pontos++;
        resultLines.push(`│ ✅ ${player2.name} faz a curva melhor! +1 ponto`);
      } else {
        resultLines.push(`│ 🤝 Empate na curva! Ninguém pontua.`);
      }
    } else if (block === "CONFRONTO") {
      const dice1 = rollDice();
      const dice2 = rollDice();
      const total1 = dice1 + player1.poder;
      const total2 = dice2 + player2.poder;

      resultLines.push(
        `│ ${player1.emoji} ${player1.name}: 🎲 ${dice1} + 💪${player1.poder} = ${total1}`
      );
      resultLines.push(
        `│ ${player2.emoji} ${player2.name}: 🎲 ${dice2} + 💪${player2.poder} = ${total2}`
      );

      if (total1 > total2) {
        player2.pontos = Math.max(0, player2.pontos - 1);
        resultLines.push(
          `│ 💥 ${player1.name} vence o confronto! ${player2.name} perde 1 ponto!`
        );
      } else if (total2 > total1) {
        player1.pontos = Math.max(0, player1.pontos - 1);
        resultLines.push(
          `│ 💥 ${player2.name} vence o confronto! ${player1.name} perde 1 ponto!`
        );
      } else {
        resultLines.push(`│ 🤝 Empate no confronto! Ninguém perde ponto.`);
      }
    } else if (block === "ITEM") {
      // Novo bloco: cada jogador pega um item aleatório
      const item1 = getRandomItem();
      const item2 = getRandomItem();

      resultLines.push(`│ ${player1.emoji} ${player1.name} pegou: ${item1.nome}`);
      resultLines.push(`│ ${player2.emoji} ${player2.name} pegou: ${item2.nome}`);

      // Aplica efeito do item do player1
      if (item1.efeito === "ganha_ponto") {
        player1.pontos++;
        resultLines.push(`│ ⬆️  ${player1.name} ganhou +1 ponto com o item!`);
      } else if (item1.efeito === "ganha_dois_pontos") {
        player1.pontos += 2;
        resultLines.push(`│ ⬆️  ${player1.name} ganhou +2 pontos com a Estrela!`);
      } else if (item1.efeito === "perde_ponto_adversario") {
        player2.pontos = Math.max(0, player2.pontos - 1);
        resultLines.push(
          `│ 💢 ${player2.name} perdeu 1 ponto por causa de ${player1.name}!`
        );
      }

      // Aplica efeito do item do player2
      if (item2.efeito === "ganha_ponto") {
        player2.pontos++;
        resultLines.push(`│ ⬆️  ${player2.name} ganhou +1 ponto com o item!`);
      } else if (item2.efeito === "ganha_dois_pontos") {
        player2.pontos += 2;
        resultLines.push(`│ ⬆️  ${player2.name} ganhou +2 pontos com a Estrela!`);
      } else if (item2.efeito === "perde_ponto_adversario") {
        player1.pontos = Math.max(0, player1.pontos - 1);
        resultLines.push(
          `│ 💢 ${player1.name} perdeu 1 ponto por causa de ${player2.name}!`
        );
      }
    }

    await printRoundResult(round, block, player1, player2, resultLines.join("\n"));
  }
}

async function printWinner(player1, player2) {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║                  🏆  RESULTADO FINAL  🏆             ║");
  console.log("╠══════════════════════════════════════════════════════╣");

  if (player1.pontos > player2.pontos) {
    console.log(`║  🥇 Vencedor: ${(player1.emoji + " " + player1.name).padEnd(38)} ║`);
    console.log(`║  🥈 Perdedor: ${(player2.emoji + " " + player2.name).padEnd(38)} ║`);
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(
      `║  Placar: ${player1.name} ${player1.pontos} x ${player2.pontos} ${player2.name}`.padEnd(54) +
        "║"
    );
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log(
      `\n🎉 Parabéns, ${player1.emoji} ${player1.name}! Você é o campeão da corrida!\n`
    );
  } else if (player2.pontos > player1.pontos) {
    console.log(`║  🥇 Vencedor: ${(player2.emoji + " " + player2.name).padEnd(38)} ║`);
    console.log(`║  🥈 Perdedor: ${(player1.emoji + " " + player1.name).padEnd(38)} ║`);
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(
      `║  Placar: ${player2.name} ${player2.pontos} x ${player1.pontos} ${player1.name}`.padEnd(54) +
        "║"
    );
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log(
      `\n🎉 Parabéns, ${player2.emoji} ${player2.name}! Você é o campeão da corrida!\n`
    );
  } else {
    console.log(`║  🤝 EMPATE! Os dois são incríveis!`.padEnd(54) + "║");
    console.log("╚══════════════════════════════════════════════════════╝");
    console.log(`\n🤝 Incrível! ${player1.name} e ${player2.name} empataram!\n`);
  }
}

async function main() {
  await printHeader();

  const [player1, player2] = getRandomCharacters();

  console.log("🎮 Personagens selecionados para a corrida:\n");
  await printCharacterStats(player1);
  await printCharacterStats(player2);
  console.log(
    "\n  Atributos: ⚡ Velocidade | 🎮 Manobrabilidade | 💪 Poder"
  );
  console.log("\n  Blocos da pista:");
  console.log("  🏎️  RETA       → usa Velocidade");
  console.log("  🔄 CURVA      → usa Manobrabilidade");
  console.log("  ⚔️  CONFRONTO  → usa Poder (perdedor perde ponto)");
  console.log("  🎁 ITEM       → item aleatório para cada jogador");

  await sleep(1500);

  await runRace(player1, player2);
  await printWinner(player1, player2);
}

main();
