import PropTypes from "prop-types";

function Calendar({ onDayClick }) {
  // 날짜 클릭
  const handleDay = (day) => {
    onDayClick(day);
  };

  return (
    <div className="absolute left-[10vw] w-[30vw] h-[100vh] bg-green-200">
      Calendar
      <button onClick={() => handleDay(1)}>날짜</button>
    </div>
  );
}
// props validation 추가
Calendar.propTypes = {
  onDayClick: PropTypes.func.isRequired,
};
export default Calendar;
