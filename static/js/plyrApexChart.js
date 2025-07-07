document.addEventListener("DOMContentLoaded", function() {
    window.Plyr && new Plyr(".js-player");
});

function timetables(transcript) {
  const data = JSON.parse(transcript);

  const series = [
    {
      name: "Segmentos",
      data: data.map((item) => ({
        x: "Texto",
        y: [item.start, item.end],
        text: item.text
      })),
    },
  ];

  const options = {
    chart: {
      type: "rangeBar",
      height: "50%",
      toolbar: { show: false },
      zoom: { enabled: false },
      offsetX: -10,
      offsetY: -10
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "35%", // más delgado
      },
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const d = data[dataPointIndex];
        return `
          <div>
            <strong>Texto:</strong> ${d.text}<br>
            <strong>Inicio:</strong> ${d.start}s<br>
            <strong>Fin:</strong> ${d.end}s
          </div>
        `;
      }
    },
    xaxis: {
      type: "numeric",
      title: {
        text: "Tiempo (s)",
        style: { fontSize: '11px' }
      },
      labels: {
        style: { fontSize: '10px' }
      }
    },
    yaxis: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
      }
    }
  };

  const chart = new ApexCharts(document.querySelector("#transcription_chart"), {
    series,
    ...options,
  });

  chart.render();
}

function objectTables(objetos) {
  const data = JSON.parse(objetos);
  const grouped = d3.group(data, d => d.objeto);
  const duration = Math.max(...data.map(d => d.cierre));
  const maxConf = Math.max(...data.map(d => d.conf));

  const series = Array.from(grouped, ([key, values]) => ({
    name: key,
    data: values.map(d => ({
      x: d.inicio,
      y: d.conf,
      cierre: d.cierre
    }))
  }));

  const options = {
    chart: {
      type: "line",
      height: "50%",
      toolbar: { show: false },
      zoom: { enabled: false },
      offsetX: -10,
      offsetY: -10
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    markers: {
      size: 3
    },
    tooltip: {
      enabled: true,
      shared: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const point = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div>
            <strong>Objeto:</strong> ${w.config.series[seriesIndex].name}<br>
            <strong>Inicio:</strong> ${point.x}s<br>
            <strong>Cierre:</strong> ${point.cierre}s<br>
            <strong>Confiabilidad:</strong> ${point.y}
          </div>
        `;
      }
    },
    xaxis: {
      type: "numeric",
      title: {
        text: "Tiempo (s)",
        style: { fontSize: "11px" }
      },
      labels: {
        style: { fontSize: "10px" }
      }
    },
    yaxis: {
      min: 0,
      max: Math.ceil(maxConf),
      title: {
        text: "Conf.",
        style: { fontSize: "11px" }
      },
      labels: {
        style: { fontSize: "10px" }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: "bottom",
      fontSize: "10px"
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  };

  const chart = new ApexCharts(document.querySelector("#object_chart"), {
    series,
    ...options
  });

  chart.render();
}