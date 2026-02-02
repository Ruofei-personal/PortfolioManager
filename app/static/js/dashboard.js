const colors = ["#38bdf8", "#818cf8", "#fbbf24", "#f472b6", "#4ade80", "#fb7185"];
const labels = chartData.map((item) => item.label);
const values = chartData.map((item) => item.value);

if (labels.length > 0) {
  const pieCtx = document.getElementById("holdingsPie");
  new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      cutout: "70%",
      animation: {
        animateRotate: true,
        duration: 1200,
      },
      plugins: {
        legend: {
          labels: { color: "#e5e7eb" },
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              return `${context.label}: ¥ ${value.toLocaleString("zh-CN")}`;
            },
          },
        },
      },
    },
  });

  const barCtx = document.getElementById("holdingsBar");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "成本总额",
          data: values,
          backgroundColor: "#38bdf8",
          borderRadius: 8,
          maxBarThickness: 40,
        },
      ],
    },
    options: {
      scales: {
        x: { ticks: { color: "#e5e7eb" }, grid: { color: "rgba(148,163,184,0.1)" } },
        y: { ticks: { color: "#e5e7eb" }, grid: { color: "rgba(148,163,184,0.1)" } },
      },
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
        tooltip: {
          callbacks: {
            label: (context) => `¥ ${context.parsed.y.toLocaleString("zh-CN")}`,
          },
        },
      },
    },
  });
}
