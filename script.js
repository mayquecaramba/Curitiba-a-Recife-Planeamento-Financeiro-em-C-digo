// Dados centralizados da planilha
const dadosViagem = [
  { categoria: 'Passagem de avião', precoUnitario: 1300, quantidade: 1 },
  { categoria: 'Hospedagem', precoUnitario: 200, quantidade: 5 },
  { categoria: 'Alimentação', precoUnitario: 100, quantidade: 5 },
  { categoria: 'Transporte', precoUnitario: 50, quantidade: 3 }
];

// Utilitário para formatar moeda em R$
const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Inicialização dos elementos
function carregarDashboard() {
  const tabelaBody = document.querySelector('#detalhes-tabela tbody');
  let valorTotalGeral = 0;
  let maiorGasto = { categoria: '', valor: 0 };

  // Limpa tabela
  tabelaBody.innerHTML = '';

  // Processa dados
  const labels = [];
  const valoresFinais = [];

  dadosViagem.forEach((item) => {
    const valorFinal = item.precoUnitario * item.quantidade;
    valorTotalGeral += valorFinal;

    if (valorFinal > maiorGasto.valor) {
      maiorGasto = { categoria: item.categoria, valor: valorFinal };
    }

    labels.push(item.categoria);
    valoresFinais.push(valorFinal);

    // Adiciona linha na tabela
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-bold">${item.categoria}</td>
      <td>${formatarMoeda(item.precoUnitario)}</td>
      <td>${item.quantidade}</td>
      <td class="font-bold">${formatarMoeda(valorFinal)}</td>
    `;
    tabelaBody.appendChild(tr);
  });

  // Atualiza cartões de KPI
  document.getElementById('total-value').innerText = formatarMoeda(valorTotalGeral);
  document.getElementById('highest-expense').innerText = `${maiorGasto.categoria}`;
  document.getElementById('total-categories').innerText = dadosViagem.length;

  // Renderiza Gráfico de Barras com Chart.js
  const ctx = document.getElementById('viagemChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Custo Total (R$)',
        data: valoresFinais,
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        hoverBackgroundColor: '#4338ca'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` Custo: ${formatarMoeda(context.raw)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatarMoeda(value)
          },
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', carregarDashboard);
