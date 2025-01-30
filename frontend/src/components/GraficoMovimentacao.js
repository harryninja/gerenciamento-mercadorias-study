import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  import { Bar } from "react-chartjs-2";

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const data = {
    labels: ["Janeiro", "Fevereiro", "Março"],
    datasets: [
      {
        label: "Entradas",
        data: [50, 70, 30],
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Movimentação de Mercadorias" }
    }
  };

  const GraficoMovimentacao = () => {
    return <Bar data={data} options={options} />;
  };

  export default GraficoMovimentacao;
