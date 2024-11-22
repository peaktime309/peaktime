import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 임포트

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels // 플러그인 등록
);

ChartJS.unregister(ChartDataLabels);

const HorizontalBarChart = ({ listArray, ylabel }) => {
  const chartRef = useRef(null);
  const colors = ["#FF6384", "#FFCE56", "#03C777", "#36A2EB", "#9966FF"];

  const dataArray = [...listArray, ...Array(5).fill(0)].slice(0, 5);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = new ChartJS(chartRef.current, {
        type: "bar",
        data: {
          labels: dataArray.map((item) => item?.name || ""),
          datasets: [
            {
              label: "사용 시간 (분)",
              data: dataArray.map((item) => (item.usingTime / 60).toFixed(1)),
              backgroundColor: colors.slice(0, dataArray.length),
              borderColor: colors.slice(0, dataArray.length),
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              beginAtZero: true,
              min: 0,
              title: {
                display: true,
                text: "시간 (분)", // x축 라벨
                color: "#FFFFFF",
                font: {
                  size: 15,
                },
              },
              grid: {
                color: "#666666",
              },
              border: {
                color: "#FFFFFF",
              },
              ticks: {
                color: "#FFFFFF",
                font: {
                  size: 15,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: ylabel,
                color: "#FFFFFF",
                font: { size: 15 },
              },
              ticks: {
                display: false,
              },
              grid: {
                color: "#666666",
              },
              border: {
                color: "#FFFFFF",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              anchor: "end", // 데이터 레이블 위치 설정
              align: "start",
              color: "white",
              formatter: (value, context) =>
                context.chart.data.labels[context.dataIndex], // 막대 안에 name 표시
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [listArray]);

  return <canvas ref={chartRef} />;
};

HorizontalBarChart.propTypes = {
  listArray: PropTypes.arrayOf(
    PropTypes.shape({
      usingTime: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  ylabel: PropTypes.string.isRequired,
};

export default HorizontalBarChart;
