import Title from "../components/common/Title";
import { useMemoStore } from "../stores/MemoStore";
import { useEffect } from "react";
import ItemList from "../components/Memo/ItemList";
import MemoDetailPrompt from "../components/Memo/MemoDetailPrompt";
import MemoDetail from "../components/Memo/MemoDetail";
import SummaryDetail from "../components/Memo/SummaryDetail";
import LoadingOverlay from "../components/Memo/LoadingOverlay";

function MemoPage() {
  const { activeTab, selectedMemo, selectedSummary, isLoading, resetAll } =
    useMemoStore();

  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"메모 및 요약"} />

      <div className="h-[90vh] top-[10vh]">
        <ItemList />
        {activeTab === "memo" && <MemoDetailPrompt />}
        {activeTab === "memo" && selectedMemo && <MemoDetail />}
        {activeTab === "summary" && selectedSummary && <SummaryDetail />}
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  );
}

export default MemoPage;
