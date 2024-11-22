import { useEffect } from "react";
import Title from "../components/common/Title";
import Calendar from "../components/Report/Calendar"; // 캘린더
import DailyReport from "../components/Report/DailyReport"; // 하루 요약
import { useReportStore } from "../stores/ReportStore";

function ReportPage() {
  const { selectedDay, resetAll } = useReportStore();

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"월간 하이킹 내역"} />
      <div className="h-[90vh] top-[10vh]">
        <Calendar />
        {selectedDay && <DailyReport />}
      </div>
    </div>
  );
}

export default ReportPage;
