import { useEffect, useState } from "react";
import PresetList from "../components/Preset/PresetList"; // 프리셋 리스트
import PresetSetting from "../components/Preset/PresetSetting";
import Title from "../components/common/Title";
import usePresetStore from "../stores/PresetStore";

function PresetSettingPage() {
  const { selectedPreset, selectPreset, resetPreset } = usePresetStore();

  // 선택한 프리셋 정보
  const [updateTrigger, setUpdateTrigger] = useState(false); // setting에서 list로 변경됨을 알려주는 trigger

  const onPresetClick = (preset) => {
    selectPreset(preset.presetId);
  };

  // 설정창 돌아가기
  const onCancel = () => {
    selectPreset(null);
  };

  // 페이지 언마운트 시 리셋
  useEffect(() => {
    return () => {
      resetPreset();
    };
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <Title title={"차단 관리"} />
      <div className="h-[90vh] top-[10vh]">
        <PresetList
          onPresetClick={(preset) => onPresetClick(preset)}
          updateTrigger={updateTrigger}
        />
        {selectedPreset && (
          <PresetSetting
            onCancel={onCancel}
            setUpdateTrigger={setUpdateTrigger}
          />
        )}
      </div>
    </div>
  );
}

export default PresetSettingPage;
