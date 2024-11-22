import * as d3 from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const CircleChart = ({ startTimeList }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const timeInterval = 1; // 분 단위
  const numberOfTimeUnit = 60 / timeInterval; // 한 시간당 단위 수
  const val = 5; // 기준값

  const renderChart = () => {
    const container = containerRef.current;
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

    const vw = containerWidth;
    const vh = containerHeight;

    const amUsageCount = Array(12 * numberOfTimeUnit).fill(0);
    const pmUsageCount = Array(12 * numberOfTimeUnit).fill(0);

    // 데이터 가공
    startTimeList.forEach((time) => {
      const [hour, minute] = time.split(":");
      const timeToMinutes = Number(hour) * 60 + Number(minute);
      const isAm = Number(hour) < 12;

      const idx = Math.floor((timeToMinutes % (12 * 60)) / timeInterval);
      if (isAm) {
        amUsageCount[idx] += 1;
      } else {
        pmUsageCount[idx] += 1;
      }
    });

    const maxCount = Math.max(...amUsageCount, ...pmUsageCount); // 최대값 계산

    const svg = d3.select(svgRef.current).attr("width", vw).attr("height", vh);

    const centerX = vw / 2;
    const centerY = vh / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#000000")
      .style("color", "#FFFFFF")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("visibility", "hidden")
      .style("font-size", "15px")
      .style("top", 0)
      .style("left", 0);

    const drawChart = (usageCount, offsetX, label) => {
      const group = svg
        .append("g")
        .attr("transform", `translate(${offsetX + centerX}, ${centerY})`);

      // 방사형 grid 추가
      const numGrids = 5;
      for (let i = 1; i <= numGrids; i++) {
        const gridRadius = (radius / numGrids) * i;
        group
          .append("circle")
          .attr("r", gridRadius)
          .attr("fill", "none")
          .attr("stroke", "#C5C5C5")
          .attr("stroke-dasharray", "2,2");
      }

      // 12시간 눈금 추가
      const angleStep = (2 * Math.PI) / 12;
      for (let i = 0; i < 12; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        group
          .append("text")
          .attr("x", x * (radius + 20))
          .attr("y", y * (radius + 20))
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "#FFFFFF")
          .style("font-size", "1.25rem")
          .text(i === 0 ? 12 : i);

        group
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x * radius)
          .attr("y2", y * radius)
          .attr("stroke", "#C5C5C5")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2.2");
      }

      // 데이터 tic 추가
      usageCount.forEach((count, idx) => {
        if (count > 0) {
          const angle = (idx / numberOfTimeUnit) * ((2 * Math.PI) / 12) - Math.PI / 2;
          const outerRadius = radius;
          const innerRadius =
            maxCount <= val
              ? radius - (radius * count) / val
              : radius - (radius * count) / maxCount;

          const x1 = Math.cos(angle) * outerRadius;
          const y1 = Math.sin(angle) * outerRadius;
          const x2 = Math.cos(angle) * innerRadius;
          const y2 = Math.sin(angle) * innerRadius;

          group
            .append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x1)
            .attr("y2", y1)
            .attr("stroke", label === "AM" ? "#FF4500" : "#3476D0")
            .attr("stroke-width", 2)
            .on("mouseover", function (event) {
              tooltip
                .style("visibility", "visible")
                .text(
                  `${label} ${String(Math.floor(idx / numberOfTimeUnit)).padStart(2, "0")}:${String(
                    (idx % numberOfTimeUnit) * timeInterval
                  ).padStart(2, "0")}, 사용 횟수: ${count}`
                );
            })
            .on("mousemove", function (event) {
              tooltip
                .style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", function () {
              tooltip.style("visibility", "hidden");
            })
            .transition()
            .duration(1000)
            .attr("x2", x2)
            .attr("y2", y2);
        }
      });
    };

    drawChart(amUsageCount, -radius - 0.075 * vw, "AM");
    drawChart(pmUsageCount, radius + 0.075 * vw, "PM");

    // 범례 추가
    const legend = svg.append("g").attr("class", "legend");

    legend
      .append("rect")
      .attr("x", centerX - 60)
      .attr("y", centerY + radius + 10)
      .attr("width", 20)
      .attr("height", 12)
      .attr("fill", "#FF4500");

    legend
      .append("text")
      .attr("x", centerX - 30)
      .attr("y", centerY + radius + 22)
      .text("오전")
      .style("font-size", "18px")
      .attr("fill", "#FFFFFF");

    legend
      .append("rect")
      .attr("x", centerX + 20)
      .attr("y", centerY + radius + 10)
      .attr("width", 20)
      .attr("height", 12)
      .attr("fill", "#3476D0");

    legend
      .append("text")
      .attr("x", centerX + 50)
      .attr("y", centerY + radius + 22)
      .text("오후")
      .style("font-size", "18px")
      .attr("fill", "#FFFFFF");
  };

  useEffect(() => {
    renderChart();

    const handleResize = () => {
      d3.select(svgRef.current).selectAll("*").remove(); // 기존 차트만 초기화
      renderChart(); // 차트 다시 그리기
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [startTimeList]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-visible">
      <svg ref={svgRef} />
    </div>
  );
};

CircleChart.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CircleChart;
