#!/usr/bin/env node

const readline = require("readline");

// ─── ANSI Colors ────────────────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgOrange: "\x1b[48;5;208m",
  orange: "\x1b[38;5;208m",
  bgGray: "\x1b[48;5;236m",
  gray: "\x1b[38;5;245m",
  bgGreen: "\x1b[42m",
  bgBlue: "\x1b[44m",
};

const fmt = {
  title: (s) => `${C.bold}${C.orange}${s}${C.reset}`,
  section: (s) => `${C.bold}${C.white}${s}${C.reset}`,
  success: (s) => `${C.green}✔  ${s}${C.reset}`,
  error: (s) => `${C.red}✖  ${s}${C.reset}`,
  warn: (s) => `${C.yellow}⚠  ${s}${C.reset}`,
  info: (s) => `${C.cyan}ℹ  ${s}${C.reset}`,
  price: (n) => `${C.bold}${C.green}R$ ${n.toFixed(2)}${C.reset}`,
  strike: (n) => `${C.dim}${C.red}R$ ${n.toFixed(2)}${C.reset}`,
  badge: (s) => `${C.bgOrange}${C.bold} ${s} ${C.reset}`,
  tag: (s) => `${C.bgGray}${C.gray} ${s} ${C.reset}`,
  id: (s) => `${C.bold}${C.cyan}#${s}${C.reset}`,
  num: (s) => `${C.bold}${C.yellow}${s}${C.reset}`,
};

// ─── Product Catalog ────────────────────────────────────────────────────────
const CATALOG = [
  { id: 1,  name: "Fone Bluetooth TWS Pro",       price: 89.90,  originalPrice: 149.90, category: "Eletrônicos", stock: 50, rating: 4.8, sold: 12400, emoji: "🎧" },
  { id: 2,  name: "Cabo USB-C 2m Trançado",        price: 19.90,  originalPrice: 35.00,  category: "Acessórios",  stock: 200, rating: 4.6, sold: 45000, emoji: "🔌" },
  { id: 3,  name: "Suporte Celular Veicular",       price: 34.90,  originalPrice: 59.90,  category: "Acessórios",  stock: 80,  rating: 4.5, sold: 8900,  emoji: "📱" },
  { id: 4,  name: "Smartwatch Fitness Band X5",     price: 159.00, originalPrice: 299.00, category: "Eletrônicos", stock: 30,  rating: 4.7, sold: 5600,  emoji: "⌚" },
  { id: 5,  name: "Mochila Notebook 15.6\" Slim",   price: 129.00, originalPrice: 189.00, category: "Bolsas",      stock: 45,  rating: 4.9, sold: 7800,  emoji: "🎒" },
  { id: 6,  name: "Mouse Sem Fio Ergonômico",       price: 49.90,  originalPrice: 89.00,  category: "Periféricos", stock: 120, rating: 4.7, sold: 23000, emoji: "🖱️" },
  { id: 7,  name: "Teclado Mecânico TKL RGB",       price: 219.00, originalPrice: 349.00, category: "Periféricos", stock: 20,  rating: 4.8, sold: 3400,  emoji: "⌨️" },
  { id: 8,  name: "Película Vidro Temperado 9H",    price: 9.90,   originalPrice: 19.90,  category: "Proteção",    stock: 500, rating: 4.4, sold: 89000, emoji: "🛡️" },
  { id: 9,  name: "Carregador Turbo 65W GaN",       price: 79.90,  originalPrice: 120.00, category: "Eletrônicos", stock: 60,  rating: 4.9, sold: 15000, emoji: "⚡" },
  { id: 10, name: "Hub USB-C 7 em 1 Alumínio",      price: 99.90,  originalPrice: 159.90, category: "Acessórios",  stock: 35,  rating: 4.6, sold: 6700,  emoji: "🔗" },
];

// ─── Cart State ──────────────────────────────────────────────────────────────
const cart = {
  items: [],
  coupon: null,
  frete: null,
};

const COUPONS = {
  SHOPEE10: { type: "percent", value: 10,   desc: "10% de desconto" },
  FRETE0:   { type: "frete",   value: 0,    desc: "Frete grátis" },
  OFF20:    { type: "fixed",   value: 20,   desc: "R$ 20,00 de desconto" },
  MEGA50:   { type: "percent", value: 50,   desc: "50% de desconto (limitado)" },
};

const FRETES = {
  standard: { label: "Padrão (7-10 dias)",    price: 12.90 },
  express:  { label: "Expresso (2-3 dias)",   price: 24.90 },
  same_day: { label: "Same Day (hoje)",       price: 39.90 },
};

// ─── Cart Logic ──────────────────────────────────────────────────────────────
function getCartItem(productId) {
  return cart.items.find((i) => i.productId === productId);
}

function addToCart(productId, qty = 1) {
  const product = CATALOG.find((p) => p.id === productId);
  if (!product) return { ok: false, msg: "Produto não encontrado." };
  if (qty < 1) return { ok: false, msg: "Quantidade inválida." };

  const existing = getCartItem(productId);
  const totalQty = (existing ? existing.qty : 0) + qty;
  if (totalQty > product.stock)
    return { ok: false, msg: `Estoque insuficiente. Disponível: ${product.stock}` };

  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ productId, qty, selected: true });
  }
  return { ok: true, msg: `${product.emoji} "${product.name}" adicionado (x${qty})` };
}

function removeFromCart(productId) {
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx === -1) return { ok: false, msg: "Item não está no carrinho." };
  const product = CATALOG.find((p) => p.id === productId);
  cart.items.splice(idx, 1);
  return { ok: true, msg: `"${product.name}" removido do carrinho.` };
}

function updateQty(productId, qty) {
  if (qty <= 0) return removeFromCart(productId);
  const product = CATALOG.find((p) => p.id === productId);
  if (!product) return { ok: false, msg: "Produto não encontrado." };
  if (qty > product.stock) return { ok: false, msg: `Estoque insuficiente. Máx: ${product.stock}` };
  const item = getCartItem(productId);
  if (!item) return { ok: false, msg: "Item não está no carrinho." };
  item.qty = qty;
  return { ok: true, msg: `Quantidade de "${product.name}" atualizada para ${qty}.` };
}

function toggleSelect(productId) {
  const item = getCartItem(productId);
  if (!item) return { ok: false, msg: "Item não está no carrinho." };
  item.selected = !item.selected;
  const product = CATALOG.find((p) => p.id === productId);
  return { ok: true, msg: `"${product.name}" ${item.selected ? "selecionado" : "desmarcado"}.` };
}

function applyCoupon(code) {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return { ok: false, msg: "Cupom inválido ou expirado." };
  cart.coupon = { code: code.toUpperCase(), ...coupon };
  return { ok: true, msg: `Cupom ${code.toUpperCase()} aplicado: ${coupon.desc}` };
}

function setFrete(type) {
  const frete = FRETES[type];
  if (!frete) return { ok: false, msg: "Opção de frete inválida." };
  cart.frete = { type, ...frete };
  return { ok: true, msg: `Frete "${frete.label}" selecionado.` };
}

function clearCart() {
  cart.items = [];
  cart.coupon = null;
  cart.frete = null;
  return { ok: true, msg: "Carrinho esvaziado." };
}

function calcTotals() {
  const selectedItems = cart.items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((acc, i) => {
    const p = CATALOG.find((p) => p.id === i.productId);
    return acc + p.price * i.qty;
  }, 0);
  const originalSubtotal = selectedItems.reduce((acc, i) => {
    const p = CATALOG.find((p) => p.id === i.productId);
    return acc + p.originalPrice * i.qty;
  }, 0);
  const catalogDiscount = originalSubtotal - subtotal;

  let couponDiscount = 0;
  if (cart.coupon) {
    if (cart.coupon.type === "percent") couponDiscount = subtotal * (cart.coupon.value / 100);
    else if (cart.coupon.type === "fixed") couponDiscount = Math.min(cart.coupon.value, subtotal);
  }

  let fretePrice = cart.frete ? cart.frete.price : 0;
  if (cart.coupon && cart.coupon.type === "frete") fretePrice = 0;

  const afterCoupon = subtotal - couponDiscount;
  const total = afterCoupon + fretePrice;
  const totalSavings = catalogDiscount + couponDiscount + (cart.coupon?.type === "frete" ? (cart.frete?.price || 0) : 0);
  const totalItems = selectedItems.reduce((acc, i) => acc + i.qty, 0);

  return { subtotal, originalSubtotal, catalogDiscount, couponDiscount, fretePrice, afterCoupon, total, totalSavings, totalItems, selectedCount: selectedItems.length };
}

// ─── Display Helpers ─────────────────────────────────────────────────────────
const LINE = `${C.dim}${"─".repeat(62)}${C.reset}`;
const DLINE = `${C.orange}${"═".repeat(62)}${C.reset}`;

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
}

function discount(orig, price) {
  return Math.round(((orig - price) / orig) * 100);
}

function printHeader() {
  console.log("");
  console.log(DLINE);
  console.log(`${C.bgOrange}${C.bold}${"   🛒  SHOPEE CART  —  Sistema de Compras Terminal".padEnd(62)}${C.reset}`);
  console.log(DLINE);
}

function printMenu() {
  console.log(`
${fmt.section("MENU PRINCIPAL")}
${LINE}
  ${fmt.badge("1")} Listar produtos          ${fmt.badge("2")} Ver carrinho
  ${fmt.badge("3")} Adicionar produto        ${fmt.badge("4")} Remover produto
  ${fmt.badge("5")} Alterar quantidade       ${fmt.badge("6")} Selecionar/desmarcar item
  ${fmt.badge("7")} Aplicar cupom            ${fmt.badge("8")} Escolher frete
  ${fmt.badge("9")} Finalizar pedido         ${fmt.badge("0")} Limpar carrinho
  ${fmt.badge("?")} Buscar produto           ${fmt.badge("q")} Sair
${LINE}`);
}

function printCatalog(products = CATALOG) {
  console.log(`\n${fmt.section("📦 PRODUTOS DISPONÍVEIS")} ${fmt.tag(products.length + " itens")}`);
  console.log(LINE);
  products.forEach((p) => {
    const disc = discount(p.originalPrice, p.price);
    const lowStock = p.stock <= 10 ? ` ${C.red}⚠ Últimas ${p.stock} unidades!${C.reset}` : "";
    console.log(
      `  ${fmt.id(String(p.id).padStart(2, "0"))} ${p.emoji} ${C.bold}${p.name}${C.reset}`
    );
    console.log(
      `       ${fmt.price(p.price)}  ${fmt.strike(p.originalPrice)}  ${C.bgRed}${C.bold} -${disc}% ${C.reset}  ${C.gray}${stars(p.rating)} (${p.sold.toLocaleString("pt-BR")} vendidos)${C.reset}${lowStock}`
    );
    console.log(`       ${fmt.tag(p.category)}  ${C.gray}Estoque: ${p.stock}${C.reset}`);
    console.log("");
  });
}

function printCart() {
  console.log(`\n${fmt.section("🛒 SEU CARRINHO")}`);
  if (cart.items.length === 0) {
    console.log(fmt.warn("Seu carrinho está vazio."));
    return;
  }
  console.log(LINE);
  console.log(
    `  ${C.dim}${"Sel".padEnd(4)}${"ID".padEnd(5)}${"Produto".padEnd(30)}${"Qtd".padEnd(6)}${"Unit.".padEnd(12)}${"Subtotal".padEnd(10)}${C.reset}`
  );
  console.log(LINE);

  cart.items.forEach((item) => {
    const p = CATALOG.find((p) => p.id === item.productId);
    const sel = item.selected ? `${C.green}[✔]${C.reset}` : `${C.dim}[ ]${C.reset}`;
    const sub = p.price * item.qty;
    const name = (p.emoji + " " + p.name).substring(0, 29).padEnd(29);
    console.log(
      `  ${sel} ${fmt.id(String(p.id).padStart(2, "0"))}  ${name} ${C.yellow}x${item.qty.toString().padEnd(4)}${C.reset} ${C.green}R$ ${p.price.toFixed(2).padEnd(10)}${C.reset}${C.bold}R$ ${sub.toFixed(2)}${C.reset}`
    );
  });

  console.log(LINE);
  const t = calcTotals();
  console.log(`  ${C.dim}Itens selecionados: ${t.selectedCount} | Qtd total: ${t.totalItems}${C.reset}`);

  if (t.catalogDiscount > 0) {
    console.log(`  ${C.dim}Subtotal original:${C.reset}   ${fmt.strike(t.originalSubtotal)}`);
    console.log(`  Subtotal:            ${fmt.price(t.subtotal)}`);
    console.log(`  ${C.green}Desconto catálogo:${C.reset}   ${C.green}-R$ ${t.catalogDiscount.toFixed(2)}${C.reset}`);
  } else {
    console.log(`  Subtotal:            ${fmt.price(t.subtotal)}`);
  }

  if (cart.coupon) {
    const couponLine = cart.coupon.type === "frete"
      ? "Frete grátis (cupom)"
      : `-R$ ${t.couponDiscount.toFixed(2)}`;
    console.log(`  ${C.magenta}Cupom ${cart.coupon.code}:${C.reset}         ${C.magenta}${couponLine}${C.reset}`);
  }

  if (cart.frete) {
    const freteValor = cart.coupon?.type === "frete"
      ? `${C.green}GRÁTIS${C.reset}`
      : `R$ ${t.fretePrice.toFixed(2)}`;
    console.log(`  Frete (${cart.frete.label.split(" ")[0]}):       ${freteValor}`);
  } else {
    console.log(`  ${C.yellow}Frete:               Não selecionado${C.reset}`);
  }

  console.log(LINE);
  console.log(`  ${C.bold}${C.orange}TOTAL:               R$ ${t.total.toFixed(2)}${C.reset}`);
  if (t.totalSavings > 0) {
    console.log(`  ${C.green}💰 Você economiza:    R$ ${t.totalSavings.toFixed(2)}${C.reset}`);
  }
  console.log("");
}

function printFreteOptions() {
  console.log(`\n${fmt.section("🚚 OPÇÕES DE FRETE")}`);
  console.log(LINE);
  Object.entries(FRETES).forEach(([key, f]) => {
    const selected = cart.frete?.type === key ? ` ${C.green}← selecionado${C.reset}` : "";
    console.log(`  ${fmt.tag(key.padEnd(10))} ${f.label.padEnd(28)} ${fmt.price(f.price)}${selected}`);
  });
  console.log(LINE);
}

function printCoupons() {
  console.log(`\n${fmt.section("🏷️  CUPONS DISPONÍVEIS")}`);
  console.log(LINE);
  Object.entries(COUPONS).forEach(([code, c]) => {
    const active = cart.coupon?.code === code ? ` ${C.green}← ativo${C.reset}` : "";
    console.log(`  ${fmt.badge(code.padEnd(10))} ${c.desc}${active}`);
  });
  console.log(LINE);
}

function printOrder() {
  if (cart.items.length === 0 || calcTotals().selectedCount === 0) {
    console.log(fmt.error("Carrinho vazio ou nenhum item selecionado."));
    return false;
  }
  if (!cart.frete) {
    console.log(fmt.warn("Selecione uma opção de frete antes de finalizar."));
    return false;
  }
  const t = calcTotals();
  const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const eta = cart.frete.type === "same_day" ? "Hoje" : cart.frete.type === "express" ? "2-3 dias" : "7-10 dias";

  console.log("");
  console.log(DLINE);
  console.log(`${C.bgGreen}${C.bold}${"  ✅  PEDIDO CONFIRMADO!".padEnd(62)}${C.reset}`);
  console.log(DLINE);
  console.log(`\n  Número do pedido: ${fmt.badge(orderId)}`);
  console.log(`  Previsão de entrega: ${C.cyan}${eta}${C.reset} via ${C.bold}${cart.frete.label}${C.reset}\n`);

  const selectedItems = cart.items.filter((i) => i.selected);
  selectedItems.forEach((item) => {
    const p = CATALOG.find((p) => p.id === item.productId);
    console.log(`  ${p.emoji} ${p.name} x${item.qty}  —  R$ ${(p.price * item.qty).toFixed(2)}`);
  });

  console.log(LINE);
  console.log(`  ${C.bold}Total pago: R$ ${t.total.toFixed(2)}${C.reset}`);
  if (t.totalSavings > 0) console.log(`  ${C.green}Você economizou: R$ ${t.totalSavings.toFixed(2)}${C.reset}`);
  console.log(LINE);
  console.log(fmt.success("Obrigado pela sua compra! 🧡\n"));
  return true;
}

// ─── CLI Loop ────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function feedback(result) {
  if (result.ok) console.log(fmt.success(result.msg));
  else console.log(fmt.error(result.msg));
}

async function promptInt(label, min, max) {
  while (true) {
    const raw = await ask(`  ${label}: `);
    const n = parseInt(raw.trim());
    if (!isNaN(n) && n >= min && n <= max) return n;
    console.log(fmt.error(`Digite um número entre ${min} e ${max}.`));
  }
}

async function main() {
  printHeader();
  console.log(fmt.info("Bem-vindo ao Shopee Cart! Digite o número da opção desejada."));
  printMenu();

  while (true) {
    const cmd = (await ask(`\n${C.orange}shopee${C.reset}${C.bold}>${C.reset} `)).trim().toLowerCase();

    switch (cmd) {
      case "1":
        printCatalog();
        break;

      case "2":
        printCart();
        break;

      case "3": {
        printCatalog();
        const id = await promptInt("ID do produto", 1, CATALOG.length);
        const qty = await promptInt("Quantidade", 1, 99);
        feedback(addToCart(id, qty));
        break;
      }

      case "4": {
        printCart();
        if (cart.items.length === 0) break;
        const id = await promptInt("ID do produto para remover", 1, 9999);
        feedback(removeFromCart(id));
        break;
      }

      case "5": {
        printCart();
        if (cart.items.length === 0) break;
        const id = await promptInt("ID do produto", 1, 9999);
        const qty = await promptInt("Nova quantidade (0 = remover)", 0, 99);
        feedback(updateQty(id, qty));
        break;
      }

      case "6": {
        printCart();
        if (cart.items.length === 0) break;
        const id = await promptInt("ID do produto para selecionar/desmarcar", 1, 9999);
        feedback(toggleSelect(id));
        break;
      }

      case "7": {
        printCoupons();
        const code = await ask("  Digite o código do cupom: ");
        feedback(applyCoupon(code.trim()));
        break;
      }

      case "8": {
        printFreteOptions();
        const type = await ask("  Digite o tipo (standard / express / same_day): ");
        feedback(setFrete(type.trim()));
        break;
      }

      case "9": {
        printCart();
        const confirm = await ask("  Confirmar pedido? (s/n): ");
        if (confirm.toLowerCase() === "s") {
          const ok = printOrder();
          if (ok) {
            clearCart();
            rl.close();
            process.exit(0);
          }
        } else {
          console.log(fmt.info("Pedido cancelado."));
        }
        break;
      }

      case "0": {
        const confirm = await ask("  Limpar todo o carrinho? (s/n): ");
        if (confirm.toLowerCase() === "s") feedback(clearCart());
        break;
      }

      case "?": {
        const query = await ask("  Buscar produto (nome ou categoria): ");
        const q = query.toLowerCase().trim();
        const results = CATALOG.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        if (results.length === 0) console.log(fmt.warn("Nenhum produto encontrado."));
        else printCatalog(results);
        break;
      }

      case "q":
      case "exit":
      case "sair":
        console.log(`\n${fmt.info("Até logo! 🧡")}\n`);
        rl.close();
        process.exit(0);

      case "":
        printMenu();
        break;

      default:
        console.log(fmt.warn(`Opção "${cmd}" não reconhecida. Digite ${C.bold}?${C.reset}${C.yellow} para ajuda ou Enter para o menu.${C.reset}`));
    }
  }
}

main().catch((e) => {
  console.error(e);
  rl.close();
  process.exit(1);
});
