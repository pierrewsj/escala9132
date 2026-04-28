const $ = (id) => document.getElementById(id);

function diaAtualDoMes() {
  const hoje = new Date();
  return hoje.getDate();
}

function diasDisponiveis() {
  return Array.from({ length: 31 }, (_, i) => i + 1);
}

function postoDescricao(posto) {
  return LEGENDA[posto] || 'Sem descrição cadastrada';
}

function iniciar() {
  preencherSelects();
  montarLegenda();
  $('tituloHoje').textContent = `${CONFIG.titulo}`;
  $('infoHoje').textContent = `${CONFIG.turno} • mês ${CONFIG.mes}`;
  registrarServiceWorker();
}

function preencherSelects() {
  $('selectNome').innerHTML = ESCALA.map(p => `<option value="${p.nome}">${p.nome}</option>`).join('');
  $('selectDia').innerHTML = diasDisponiveis().map(d => `<option value="${d}">Dia ${String(d).padStart(2, '0')}</option>`).join('');

  const postos = [...new Set(ESCALA.flatMap(p => p.dias))].sort((a,b) => a.localeCompare(b));
  $('selectPosto').innerHTML = postos.map(p => `<option value="${p}">${p}</option>`).join('');
}

function card({ titulo, badge, descricao, hoje = false }) {
  return `
    <article class="item ${hoje ? 'hoje' : ''}">
      <div class="item-topo">
        <h3>${titulo}</h3>
        <span class="badge">${badge}</span>
      </div>
      <p class="descricao">${descricao}</p>
    </article>
  `;
}

function buscarPorNome() {
  abrirResultado();
  const nome = $('selectNome').value;
  const pessoa = ESCALA.find(p => p.nome === nome);
  const hoje = diaAtualDoMes();

  $('resultadoConteudo').innerHTML = `
    <div class="lista-cards">
      <div class="card"><h2>${pessoa.nome} • ${CONFIG.turno}</h2><p class="muted">Mês ${CONFIG.mes}</p></div>
      ${pessoa.dias.map((posto, i) => {
        const dia = i + 1;
        return card({
          titulo: `Dia ${String(dia).padStart(2, '0')}`,
          badge: posto,
          descricao: postoDescricao(posto),
          hoje: dia === hoje
        });
      }).join('')}
    </div>
  `;
}

function buscarPorDia(diaInformado) {
  abrirResultado();
  const dia = Number(diaInformado || $('selectDia').value);
  const hoje = diaAtualDoMes();

  $('resultadoConteudo').innerHTML = `
    <div class="lista-cards">
      <div class="card"><h2>Escala do dia ${String(dia).padStart(2, '0')}</h2><p class="muted">${CONFIG.turno} • Equipe ${CONFIG.equipe}</p></div>
      ${ESCALA.map(pessoa => {
        const posto = pessoa.dias[dia - 1] || '-';
        return card({
          titulo: pessoa.nome,
          badge: posto,
          descricao: postoDescricao(posto),
          hoje: dia === hoje
        });
      }).join('')}
    </div>
  `;
}

function buscarPorPosto() {
  abrirResultado();
  const postoBusca = $('selectPosto').value;
  const hoje = diaAtualDoMes();
  const itens = [];

  ESCALA.forEach(pessoa => {
    pessoa.dias.forEach((posto, i) => {
      const dia = i + 1;
      if (posto === postoBusca) {
        itens.push(card({
          titulo: pessoa.nome,
          badge: `Dia ${String(dia).padStart(2, '0')}`,
          descricao: `${postoBusca} • ${postoDescricao(postoBusca)}`,
          hoje: dia === hoje
        }));
      }
    });
  });

  $('resultadoConteudo').innerHTML = `
    <div class="lista-cards">
      <div class="card"><h2>Posto ${postoBusca}</h2><p class="muted">${postoDescricao(postoBusca)}</p></div>
      ${itens.length ? itens.join('') : '<div class="resultado-vazio">Nenhum resultado encontrado.</div>'}
    </div>
  `;
}

function mostrarHoje() {
  const dia = Math.min(diaAtualDoMes(), 31);
  $('selectDia').value = String(dia);
  buscarPorDia(dia);
}

function buscaRapida() {
  abrirResultado();
  const termo = $('campoBusca').value.trim().toUpperCase();
  if (!termo) {
    $('resultadoConteudo').innerHTML = '<div class="resultado-vazio">Digite algo para pesquisar.</div>';
    return;
  }

  const numero = Number(termo);
  if (numero >= 1 && numero <= 31) {
    buscarPorDia(numero);
    return;
  }

  const pessoa = ESCALA.find(p => p.nome.includes(termo));
  if (pessoa) {
    $('selectNome').value = pessoa.nome;
    buscarPorNome();
    return;
  }

  const posto = [...new Set(ESCALA.flatMap(p => p.dias))].find(p => p.toUpperCase().includes(termo));
  if (posto) {
    $('selectPosto').value = posto;
    buscarPorPosto();
    return;
  }

  $('resultadoConteudo').innerHTML = '<div class="resultado-vazio">Nenhum resultado encontrado.</div>';
}

function montarLegenda() {
  $('legendaConteudo').innerHTML = Object.entries(LEGENDA).map(([codigo, descricao]) => card({
    titulo: codigo,
    badge: 'Local',
    descricao
  })).join('');
}

function abrirAba(id, botao) {
  document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  $(id).classList.add('ativo');
  botao.classList.add('ativa');
}

function abrirResultado() {
  document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
  $('resultado').classList.add('ativo');
  document.querySelector('.aba').classList.add('ativa');
}

async function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./service-worker.js'); } catch (e) {}
  }
}

let promptInstalacao;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  promptInstalacao = e;
  $('btnInstalar').hidden = false;
});

$('btnInstalar').addEventListener('click', async () => {
  if (!promptInstalacao) return;
  promptInstalacao.prompt();
  await promptInstalacao.userChoice;
  promptInstalacao = null;
  $('btnInstalar').hidden = true;
});

window.addEventListener('load', iniciar);
