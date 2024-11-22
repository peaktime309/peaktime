import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { useGroupStore } from "../../stores/GroupStore";

function AddGroupTimer({ onSave }) {
  const { groupId } = useGroupStore();

  const [startTime, setStartTime] = useState("00:00");
  const [attentionTime, setAttentionTime] = useState(0);
  const [repeatDay, setRepeatDay] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = () => {
    // 입력한 시각을 현재 시각과 비교해서 날짜 보정
    const now = new Date();
    const [hour, minute] = startTime.split(":").map(Number);

    const targetDate = new Date(now);
    targetDate.setHours(hour, minute, 0, 0);

    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const hours = String(targetDate.getHours()).padStart(2, "0");
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");

    const formattedStartTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    return {
      groupId,
      startTime: formattedStartTime,
      attentionTime,
      repeatDay,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "start-time":
        setStartTime(value);
        break;
      case "attention-time":
        if (!isNaN(Number(value))) {
          setAttentionTime(Number(value));
        }
        break;
      case "repeat-day":
        setRepeatDay(Number(value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onSave(handleSave);
  }, [onSave, handleSave]);

  // 요일에 해당하는 비트 값
  const dayBitValues = {
    월: 1 << 6,
    화: 1 << 5,
    수: 1 << 4,
    목: 1 << 3,
    금: 1 << 2,
    토: 1 << 1,
    일: 1 << 0,
  };

  // 요일 버튼 클릭 핸들러
  const toggleDay = (day) => {
    const bitValue = dayBitValues[day];
    setRepeatDay((prev) =>
      prev & bitValue ? prev & ~bitValue : prev | bitValue
    );
  };

  return (
    <div className="bg-[#333333] text-white flex flex-col justify-evenly items-center text-start mt-5">
      <div className="flex space-x-4">
        {/* 시작 시각 */}
        <div className="relative flex flex-col gap-3">
          <label htmlFor="start-time" className="font-bold">
            시작 시각
          </label>
          <input
            type="time"
            id="start-time"
            name="start-time"
            value={startTime || ""}
            onChange={handleChange}
            className="appearance-auto webkit-appearance-auto rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333]"
          />
          <div className="absolute right-3 bottom-8 pointer-events-none text-[#333333]">
            <MdAccessTimeFilled />
          </div>
        </div>

        {/* 시간 */}
        <div className="flex flex-col gap-3 w-full mb-5">
          <label htmlFor="attention-time" className="font-bold">
            하이킹 시간
          </label>
          <div className="flex items-center w-[50%]">
            <input
              type="text"
              id="attention-time"
              name="attention-time"
              value={attentionTime || ""}
              onChange={handleChange}
              className="rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333]"
              placeholder="시간 입력"
            />
            <span className="pointer-events-none ms-2 font-bold">분</span>
          </div>
        </div>
      </div>

      {/* repeat_day 설정 */}
      <div className="flex space-x-2 mt-2">
        {Object.keys(dayBitValues).map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-4 py-2 rounded text-white ${
              repeatDay & dayBitValues[day]
                ? "bg-[#66AADF]"
                : "bg-[#C5C5C5] text-[#333333] font-bold"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

AddGroupTimer.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default AddGroupTimer;
