document.addEventListener('DOMContentLoaded', () => {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const chartCtx = document.getElementById("habitChart").getContext("2d");

  // Cria gráfico de linha vazio
  let chart = new Chart(chartCtx, {
  type: 'line',
  data: {
    labels: months,
    datasets: [{
      // removido o label
      data: Array(12).fill(0),
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false, // desativa completamente a legenda
        onClick: null    // garante que não haja clique, se fosse exibida
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        precision: 0
      }
    }
  }
});



  // Função para atualizar o gráfico com base nos dias concluídos
  function updateChart() {
    const allDays = document.querySelectorAll(".day.completed");
    const monthlyCounts = Array(12).fill(0);

    allDays.forEach(day => {
      const date = new Date(day.dataset.date);
      monthlyCounts[date.getMonth()]++;
    });

    chart.data.datasets[0].data = monthlyCounts;
    chart.update();
  }

  // Função para criar dias em cada habit
  function generateGridForTrack(track, habitId) {
    track.innerHTML = '';
    const today = new Date();
    const daysBack = 365;
    const start = new Date();
    start.setDate(today.getDate() - daysBack);

    while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

    const saved = JSON.parse(localStorage.getItem('habit:' + habitId) || '[]');
    const completedSet = new Set(saved);

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      const el = document.createElement('div');
      el.className = 'day';
      el.dataset.date = iso;
      el.title = iso + ' — ' + ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()];

      if (completedSet.has(iso)) el.classList.add('completed');

      el.addEventListener('click', () => {
        if (el.classList.contains('completed')) {
          el.classList.remove('completed');
          completedSet.delete(iso);
        } else {
          el.classList.add('completed');
          completedSet.add(iso);
        }
        localStorage.setItem('habit:' + habitId, JSON.stringify(Array.from(completedSet)));
        updateChart();
      });

      track.appendChild(el);
    }

    // scroll horizontal com roda do mouse
    track.addEventListener('wheel', e => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // rola automaticamente para o final (hoje)
    track.scrollLeft = track.scrollWidth;
  }

  // Inicializa todos os calendários
  document.querySelectorAll('.IndividualsHabits').forEach((section, idx) => {
    const habitId = section.dataset.habit || `habit-${idx}`;
    const track = section.querySelector('.calendar');
    if (!track) return;
    generateGridForTrack(track, habitId);
  });

  // Atualiza o gráfico ao carregar
  updateChart();
});
