import { useMemoStore } from "../../stores/MemoStore";

function ItemNavigator() {
  const { activeTab, setActiveTab } = useMemoStore();

  const selectButtonItem = (item) => {
    return (
      <button
        className={`text-[18px] ${
          activeTab === item
            ? "bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
            : "bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
        }`}
        onClick={() => {
          if (activeTab === item) return;
          setActiveTab(activeTab === "memo" ? "summary" : "memo");
        }}
      >
        {item === "memo" ? "메모 목록" : "요약 기록"}
      </button>
    );
  };

  return (
    <div className="flex justify-center mb-3">
      {selectButtonItem("memo")}
      {selectButtonItem("summary")}
    </div>
  );
}

export default ItemNavigator;
