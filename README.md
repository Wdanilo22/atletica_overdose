# Atlética Overdose — site

## Estrutura
- `index.html` — todo o conteúdo e texto do site
- `css/style.css` — cores, fontes e layout
- `js/script.js` — menu mobile, animação, agenda (Google Sheets) e formulário

## O que trocar primeiro
1. **Nome/marca**: procure por "OD" e "Overdose" no `index.html` se quiserem outro nome.
2. **Cores**: no topo do `css/style.css`, dentro de `:root { ... }`, estão as variáveis de cor
   (`--orange`, `--black`, `--bg` etc). Trocar ali muda o site inteiro de uma vez.
3. **Agenda automática**: em `js/script.js`, procure `SHEET_CSV_URL = ""` e cole o link
   da planilha do Google publicada como CSV.
4. **Gestão**: em `index.html`, seção `id="gestao"`, troque nome, cargo e o `href="#"`
   pelo link real do Instagram de cada pessoa.
5. **Esportes e Títulos**: seções `id="esportes"` e `id="titulos"` no `index.html`,
   copie e cole um card (`<div class="esporte-card">...</div>` ou `<div class="titulo-card">...</div>`)
   pra adicionar mais itens.
6. **Fotos**: os blocos da galeria e da loja são placeholders coloridos — troque por
   `<img src="...">` quando tiverem as fotos reais.

## Como publicar
Qualquer serviço de hospedagem de site estático funciona, por exemplo:
- **Netlify** ou **Vercel**: arraste a pasta inteira no site deles.
- **GitHub Pages**: suba a pasta num repositório e ative o Pages nas configurações.

Não precisa de servidor, banco de dados nem build — é só HTML/CSS/JS puro.
