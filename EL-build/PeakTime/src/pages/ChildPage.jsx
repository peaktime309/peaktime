// 컴포넌트 임포트
import ChildList from "../components/Child/ChildList";
import AddChild from "../components/Child/AddChild";
import UpdateChild from "../components/Child/UpdateChild";
import AddGroup from "../components/Child/AddGroup";
import UpdateGroup from "../components/Child/UpdateGroup";
import Title from "../components/common/Title";
import { useEffect } from "react";
import { useGroupStore } from "../stores/GroupStore";
import groupsApi from "../api/groupsApi";
import presetsApi from "../api/presetsApi";
import "../styles/daily-report-custom-swal.css";
import Swal from "sweetalert2";

function ChildPage() {
  const { showNow, setGroupList, setPresetList, resetAll } = useGroupStore();

  // 페이지 진입 시 그룹 전체 조회, 프리셋 조회 API 호출
  useEffect(() => {
    groupsApi
      .get("")
      .then((result) => setGroupList(result.data.data.groupList))
      .catch(() => {
        Swal.fire({
        title: "그룹 정보 조회 실패",
        text: "그룹 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#03C777",
        customClass: {
          popup: "custom-swal-popup",
        }
      })});

    presetsApi
      .get("")
      .then((result) => setPresetList(result.data.data.presetList))
      .catch();

  // unmount 시 상태 모두 초기화
    return () => {
      resetAll();
    }
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"서브계정 관리"} />
      <div className="h-[90vh] top-[10vh]">
        <ChildList />
        {showNow === "addChild" && (
          <AddChild />
        )}
        {showNow === "updateChild" && (
          <UpdateChild />
        )}
        {showNow === "addGroup" && (
          <AddGroup />
        )}
        {showNow === "updateGroup" && (
          <UpdateGroup />
        )}
      </div>
    </div>
  );
}

export default ChildPage;
