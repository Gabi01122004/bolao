let jogosAnteriores = JSON.parse(localStorage.getItem('jogosAnteriores')) || [];
let palpites = JSON.parse(localStorage.getItem('palpites')) || [];

// Função para salvar o placar real do jogo
function salvarPlacarReal() {
  const golsFlamengoReal = document.getElementById('golsFlamengoReal').value;
  const golsAdversarioReal = document.getElementById('golsAdversarioReal').value;
  
  if (golsFlamengoReal === "" || golsAdversarioReal === "") {
    alert("Por favor, insira o placar do jogo.");
    return;
  }

  // Adiciona o placar atual aos jogos anteriores
  jogosAnteriores.push({ golsFlamengoReal, golsAdversarioReal });
  localStorage.setItem('jogosAnteriores', JSON.stringify(jogosAnteriores));

  // Mostrar a seção de palpites e o botão "Salvar Palpites"
  document.getElementById('placarSection').style.display = 'none';
  document.getElementById('palpiteSection').style.display = 'block';
}

// Função para adicionar um palpite
document.getElementById('palpiteForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const golsFlamengo = document.getElementById('golsFlamengo').value;
  const golsAdversario = document.getElementById('golsAdversario').value;

  // Verifica se o participante já deu palpites antes
  let participanteExistente = palpites.find(palpite => palpite.usuario === usuario);
  if (!participanteExistente) {
    participanteExistente = { usuario, palpites: [] };
    palpites.push(participanteExistente);
  }

  // Adiciona o palpite atual do participante
  participanteExistente.palpites.push({ golsFlamengo, golsAdversario });
  localStorage.setItem('palpites', JSON.stringify(palpites));

  // Limpa o formulário de palpite
  document.getElementById('palpiteForm').reset();
  mostrarRanking();
});

// Função para salvar todos os palpites e passar para o próximo jogo
function salvarPalpites() {
  if (palpites.length === 0) {
    alert("Adicione ao menos um palpite.");
    return;
  }

  // Limpar os palpites da seção de inserção
  document.getElementById('palpiteSection').style.display = 'none';
  document.getElementById('placarSection').style.display = 'block';
  
  // Exibir o próximo jogo
  alert("Palpites salvos! Agora insira o placar do próximo jogo.");
  
  // Reiniciar os inputs para o próximo jogo
  document.getElementById('golsFlamengoReal').value = '';
  document.getElementById('golsAdversarioReal').value = '';

  // Atualizar o ranking
  mostrarRanking();
}

// Função para calcular pontos
function calcularPontos(palpite, placarReal) {
  if (palpite.golsFlamengo == placarReal.golsFlamengoReal && palpite.golsAdversario == placarReal.golsAdversarioReal) {
    return 3;
  } else if (palpite.golsFlamengo == placarReal.golsFlamengoReal) {
    return 1;
  } else {
    return 0;
  }
}

// Função para exibir o ranking
function mostrarRanking() {
  const jogosAnteriores = JSON.parse(localStorage.getItem('jogosAnteriores')) || [];
  const palpites = JSON.parse(localStorage.getItem('palpites')) || [];
  const ranking = {};

  // Iterando sobre todos os jogos e palpites
  jogosAnteriores.forEach((placarReal, index) => {
    palpites.forEach(palpite => {
      const p = palpite.palpites[index];
      if (p) {
        const pontos = calcularPontos(p, placarReal);
        if (!ranking[palpite.usuario]) {
          ranking[palpite.usuario] = 0;
        }
        ranking[palpite.usuario] += pontos;
      }
    });
  });

  // Ordenar o ranking
  const rankingOrdenado = Object.keys(ranking).map(usuario => ({
    usuario,
    pontos: ranking[usuario]
  })).sort((a, b) => b.pontos - a.pontos);

  // Atualiza a tabela de ranking
  const tbody = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  rankingOrdenado.forEach((usuario, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${usuario.usuario}</td>
      <td>${usuario.pontos}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para gerar o PDF
function gerarPDF() {
  console.log("Gerando PDF...");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Ranking Bolão Flamengo", 10, 10);

  const table = document.getElementById('rankingTable');
  if (table) {
    console.log("Tabela encontrada, gerando PDF...");
    doc.autoTable({ html: table });
    doc.save("ranking.pdf");
  } else {
    console.log("Tabela não encontrada!");
  }
}

// Função para limpar o localStorage
function limparLocalStorage() {
  localStorage.clear();
  alert("Todos os dados foram apagados!");
  location.reload();
}



  
  
  