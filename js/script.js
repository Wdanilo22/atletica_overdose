// ====== MODO CLARO / ESCURO ======
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('overdose-theme', next); } catch (e) { /* localStorage indisponível */ }
});

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
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdC_ldVDHa3lr2OcIthpbbxI-0a6wbZuJjH_d_zTP6lRWbz_Ax4qJcSWqYIbeG7bUkMJ43ldPuBa5H/pub?gid=0&single=true&output=csv";


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
  const container = document.getElementById("rxItems");

  if (!container) {
    console.error("Elemento #rxItems não encontrado no HTML.");
    return;
  }

  container.innerHTML = "<p>Carregando eventos...</p>";

  try {
    const res = await fetch(SHEET_CSV_URL, {
      cache: "no-store"
    });

    console.log("Status HTTP:", res.status);

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    const texto = await res.text();

    console.log("CSV recebido:", texto);

    const eventos = csvToEventos(texto);

    console.log("Eventos convertidos:", eventos);

    if (eventos.length === 0) {
      throw new Error("Nenhum evento foi encontrado no CSV.");
    }

    renderEventos(eventos);

  } catch (erro) {
    console.error("Falha ao carregar a agenda:", erro);

    container.innerHTML = "";

    const mensagem = document.createElement("p");
    mensagem.className = "rx-loading";
    mensagem.textContent =
      "Não foi possível carregar os eventos. Consulte o Console.";

    container.appendChild(mensagem);
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
