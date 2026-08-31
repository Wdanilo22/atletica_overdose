// ====== MENU MOBILE ======
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// ====== ANO NO RODAPÉ ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== ANIMAÇÃO DO ELETRO (EKG) ======
const path = document.getElementById('ekg-path');
const cross = document.getElementById('ekg-cross');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  cross.classList.add('show');
} else {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  path.style.transition = 'stroke-dashoffset 2.1s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
  });
  setTimeout(() => cross.classList.add('show'), 700);
}

// ====== AGENDA (Google Sheets) ======
// Cole aqui o link publicado como CSV (Arquivo > Compartilhar > Publicar na Web > CSV).
// Enquanto estiver vazio, o site mostra eventos de exemplo.
const SHEET_CSV_URL = "";

const EXEMPLO_EVENTOS = [
  { item: "Jogo vs. Atlética de Odonto", descricao: "Futsal masculino — quadra do ginásio central", dia: "SÁB", hora: "14H", confirmado: "sim" },
  { item: "Treino aberto de vôlei", descricao: "Todos os períodos são bem-vindos", dia: "TER", hora: "19H", confirmado: "" },
  { item: "Festa de integração dos bixos", descricao: "Local a confirmar", dia: "SEX", hora: "22H", confirmado: "" },
  { item: "Reunião geral da atlética", descricao: "Eleição de novos representantes", dia: "QUA", hora: "20H", confirmado: "" },
];

// Parser simples de CSV (lida com campos entre aspas contendo vírgula).
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\n' || c === '\r') {
        if (field.length || row.length) { row.push(field); rows.push(row); }
        field = ""; row = [];
        if (c === '\r' && next === '\n') i++;
      } else { field += c; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

function csvToEventos(text) {
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim().toLowerCase());
  const idx = {
    item: header.indexOf("item"),
    descricao: header.indexOf("descricao") !== -1 ? header.indexOf("descricao") : header.indexOf("descrição"),
    dia: header.indexOf("dia"),
    hora: header.indexOf("hora"),
    confirmado: header.indexOf("confirmado"),
  };
  return rows.slice(1).map(r => ({
    item: r[idx.item] || "",
    descricao: idx.descricao !== -1 ? (r[idx.descricao] || "") : "",
    dia: r[idx.dia] || "",
    hora: r[idx.hora] || "",
    confirmado: idx.confirmado !== -1 ? (r[idx.confirmado] || "") : "",
  }));
}

function renderEventos(eventos, aviso) {
  const container = document.getElementById('rxItems');
  container.innerHTML = "";
  eventos.forEach((ev, i) => {
    const div = document.createElement('div');
    div.className = 'rx-item';
    const confirmadoBadge = /^sim|true|yes$/i.test((ev.confirmado || "").trim())
      ? '<span class="rx-badge">Confirmado</span>' : '';
    div.innerHTML = `
      <div class="rx-dose">ITEM ${i + 1}</div>
      <div class="rx-name">${ev.item}<small>${ev.descricao}</small>${confirmadoBadge}</div>
      <div class="rx-when">${ev.dia}${ev.dia && ev.hora ? ' · ' : ''}${ev.hora}</div>
    `;
    container.appendChild(div);
  });
  if (aviso) {
    const nota = document.createElement('p');
    nota.className = 'rx-loading';
    nota.style.marginTop = '10px';
    nota.textContent = aviso;
    container.appendChild(nota);
  }
}

async function carregarAgenda() {
  if (!SHEET_CSV_URL) {
    renderEventos(EXEMPLO_EVENTOS, "Exibindo agenda de exemplo — conecte a planilha real em SHEET_CSV_URL (js/script.js).");
    return;
  }
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar planilha");
    const text = await res.text();
    const eventos = csvToEventos(text);
    if (!eventos.length) throw new Error("Planilha vazia");
    renderEventos(eventos);
  } catch (err) {
    renderEventos(EXEMPLO_EVENTOS, "Não consegui carregar a planilha agora — mostrando agenda de exemplo.");
  }
}
carregarAgenda();

// ====== FORMULÁRIO DE INSCRIÇÃO (visual, sem backend ainda) ======
const form = document.getElementById('inscForm');
const msg = document.getElementById('submitMsg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  msg.classList.add('show');
  form.reset();
});
