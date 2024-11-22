import PropTypes from "prop-types";
import StackedBarChart from "./Chart/StackedBarChart";
import { useEffect, useState } from "react";
import {
  diffInMinutes,
  successToHiking,
} from "../../utils/SuccessFunctionUtils";
import "../../styles/daily-report-custom-swal.css";

function DailyReportDetail({ hikingDetail }) {
  const [visitedSiteList, setVisitedSiteList] = useState([]);
  const [visitedProgramList, setVisitedProgramList] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setVisitedSiteList(hikingDetail.visitedSiteList);
    setVisitedProgramList(hikingDetail.visitedProgramList);
  }, [hikingDetail]);

  const minutesExpression = (startTime, endTime, realEndTime) => {
    return `${diffInMinutes(startTime, realEndTime)} / ${diffInMinutes(
      startTime,
      endTime
    )}`;
  };

  // 성공, 실패 여부
  const success = successToHiking(
    hikingDetail.endTime,
    hikingDetail.realEndTime
  );

  const handleMouseOver = (event, type) => {
    let content = "";

    switch (type) {
      case "hikingTime":
        content = `시작 시각: ${hikingDetail.startTime}\n목표 종료 시각: ${hikingDetail.endTime}\n실제 종료 시각: ${hikingDetail.realEndTime}`;
        break;
      case "fallCount":
        content = `사이트: ${hikingDetail.blockedSiteCount}회\n프로그램: ${hikingDetail.blockedProgramCount}회`;
        break;
      case "site": {
        const siteList = hikingDetail?.visitedSiteList?.map(
          (site) => `${site.name}: ${Number(site.usingTime / 60).toFixed(1)}분`
        );
        content = siteList.join("\n");
        break;
      }
      case "program": {
        const programList = hikingDetail?.visitedProgramList?.map(
          (program) =>
            `${program.name}: ${Number(program.usingTime / 60).toFixed(1)}분`
        );
        content = programList.join("\n");
        break;
      }
    }

    setTooltip({
      visible: true,
      content,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className="flex flex-col items-center w-full h-full py-5 border-t border-white overflow-auto">
      <div className="flex justify-around gap-5 w-full h-full px-3">
        <div className="flex flex-col justify-center items-start w-[50%]">
          {/* 하이킹 시간, 넘어진 횟수, 성공 여부 */}
          <div className="flex mb-[5vh]">
            <div
              className="flex flex-col mr-5"
              onMouseOver={(e) => handleMouseOver(e, "hikingTime")}
              onMouseOut={handleMouseOut}
            >
              {/* 하이킹 시간 */}
              <h3 className="flex flex-col text-[30px] font-bold mb-3">
                하이킹 시간
              </h3>
              <div className="text-[25px]">
                {/* "OO / OO 분" */}
                {`${minutesExpression(
                  hikingDetail.startTime,
                  hikingDetail.endTime,
                  hikingDetail.realEndTime
                )} 분`}
              </div>
            </div>
            <div
              className="flex flex-col mr-5"
              onMouseOver={(e) => handleMouseOver(e, "fallCount")}
              onMouseOut={handleMouseOut}
            >
              {/* 넘어진 횟수 */}
              <div className="flex flex-col text-[30px] font-bold mb-3">
                넘어진 횟수
              </div>
              <div className="text-[25px]">{`${
                hikingDetail.blockedSiteCount + hikingDetail.blockedProgramCount
              } 회`}</div>
            </div>
            {/* 성공 여부 */}
            <div
              className={`text-white rounded-full font-bold text-[30px] w-[80px] h-[80px] flex items-center justify-center ${
                success ? "bg-[#03C777]" : "bg-[#F40000]"
              }`}
            >
              {success ? "성공" : "실패"}
            </div>
          </div>

          {/* 가장 많이 들른 사이트, 가장 많이 사용한 프로그램 */}
          <div className="flex flex-col items-start">
            <div
              className="mb-[5vh]"
              onMouseOver={(e) => handleMouseOver(e, "site")}
              onMouseOut={handleMouseOut}
            >
              <h3 className="flex flex-col text-[30px] font-bold mb-3">
                가장 많이 들른 사이트
              </h3>
              <div className="text-[25px] text-left">
                {visitedSiteList?.[0]?.name || ""}
              </div>
            </div>
            <div
              onMouseOver={(e) => handleMouseOver(e, "program")}
              onMouseOut={handleMouseOut}
            >
              <h3 className="flex flex-col text-[30px] font-bold mb-3">
                가장 많이 사용한 프로그램
              </h3>
              <div className="text-[25px] text-left">
                {visitedProgramList?.[0]?.name || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[50%] m-0 mt-5">
          {/* 그래프 */}
          {/* <h3 className="flex flex-col text-[30px] font-bold mb-5">
            이용 리포트
          </h3> */}
          <StackedBarChart
            visitedSiteList={hikingDetail.visitedSiteList}
            visitedProgramList={hikingDetail.visitedProgramList}
          />
        </div>
      </div>

      {/* 툴팁 */}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y - 50,
            left: tooltip.x,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

DailyReportDetail.propTypes = {
  hikingDetail: PropTypes.object.isRequired,
};

export default DailyReportDetail;
