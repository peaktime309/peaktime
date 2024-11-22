import { useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import hikingsApi from "../../api/hikingsApi";
import Swal from "sweetalert2";
import { useReportStore } from "../../stores/ReportStore";
import "../../styles/animation.css";

function Calendar() {
  const ALERT_MESSAGE = {
    failtToGetHikingList: {
      title: "내역 목록 조회 실패",
      text: "이용내역 목록 조회에 실패했습니다. 잠시 후 다시 시도해주세요.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
      customClass: {
        popup: "custom-swal-popup",
      },
    },
  };

  const colorPalette = (totalMinute) => {
    const RANGE_ARRAY = [0, 60, 120, 180, 240];

    // switch 문은 정확히 일치하는 값만 case로 사용
    if (totalMinute > RANGE_ARRAY[0] && totalMinute <= RANGE_ARRAY[1]) {
      return "#A1C7E7";
    } else if (totalMinute > RANGE_ARRAY[1] && totalMinute <= RANGE_ARRAY[2]) {
      return "#82B5E2";
    } else if (totalMinute > RANGE_ARRAY[2] && totalMinute <= RANGE_ARRAY[3]) {
      return "#66AADF";
    } else if (totalMinute > RANGE_ARRAY[3] && totalMinute <= RANGE_ARRAY[4]) {
      return "#4D90D8";
    } else if (totalMinute > RANGE_ARRAY[4]) {
      return "#3476D0";
    } else {
      return "#C5C5C5";
    }
  };

  const {
    selectedDay,
    setSelectedDay,
    hikingList,
    setHikingList,
    setHikingListIfFail,
  } = useReportStore();

  const today = new Date();
  const month = String(today.getMonth() + 1);
  const year = String(today.getFullYear());

  useEffect(() => {
    hikingsApi
      .get("/calendar")
      .then((result) => {
        setHikingList(result.data.data.hikingList);
      })
      .catch(() => {
        Swal.fire(ALERT_MESSAGE.failtToGetHikingList);
        setHikingListIfFail();
      });
  }, []);

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col p-5">
      <div className="flex items-start mb-5">
        <h2 className="self-start mb-3 text-white font-bold text-[30px]">
          캘린더
        </h2>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center items-center mb-5">
          <div className="text-[50px] font-bold text-white mr-3">
            <FaRegCalendarAlt />
          </div>
          <div className="flex items-end">
            <div className="text-[40px] font-bold text-white mr-2">
              {month}월
            </div>
            <div className="text-[30px] font-bold text-white">{year}년</div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-grid grid-cols-5 gap-2 justify-center items-center font-bold text-[20px]">
            {hikingList.map((item, idx) => (
              <button
                key={idx + 1}
                onClick={() => setSelectedDay(item.date)}
                className={`text-white rounded-lg w-[4vw] h-[4vw] ${
                  item.date === selectedDay ? "border-4 border-white" : ""
                }`}
                style={{
                  backgroundColor: colorPalette(item.totalMinute),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation = "subtlePing 0.25s forwards";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation =
                    "subtlePingReverse 0.25s forwards";
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
