import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.unregister(ChartDataLabels);

const StackedBarChart = ({ visitedSiteList, visitedProgramList }) => {
  // datasets
  const siteUsingTimes = visitedSiteList.map((site) =>
    (site.usingTime / 60).toFixed(1)
  );
  const programUsingTimes = visitedProgramList.map((program) =>
    (program.usingTime / 60).toFixed(1)
  );

  const colors = ["#FF6384", "#FFCE56", "#03C777", "#36A2EB", "#9966FF"];

  const data = {
    labels: ["사이트", "프로그램"],
    datasets: [
      ...visitedSiteList.map((site, idx) => ({
        label: `${site.name} 사용 시간`,
        data: [siteUsingTimes[idx], 0], // 사이트는 첫 번째 막대에 표시
        backgroundColor: colors[idx % colors.length], // 최대 5개까지 자료를 가져옴
        stack: "stack1",
      })),
      ...visitedProgramList.map((program, idx) => ({
        label: `${program.name} 사용 시간`,
        data: [0, programUsingTimes[idx]], // 프로그램은 두 번째 막대에 표시
        backgroundColor: colors[idx % colors.length],
        stack: "stack1",
      })),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}분`;
          },
        },
        titleColor: "#FFFFFF",
        titleFont: {
          size: 15,
        },
        bodyFont: {
          size: 15,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 15,
          },
        },
        title: {
          display: true,
        },
        border: {
          color: "#C5C5C5",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "사용 시간 (분)",
          color: "#FFFFFF",
          font: {
            size: 15,
          },
        },
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 15,
          },
        },
        border: {
          color: "#FFFFFF",
        },
      },
    },
  };

  return <Bar data={data} options={options} height={250} />;
};

StackedBarChart.propTypes = {
  visitedSiteList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usingTime: PropTypes.number.isRequired,
    })
  ).isRequired,
  visitedProgramList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usingTime: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StackedBarChart;
