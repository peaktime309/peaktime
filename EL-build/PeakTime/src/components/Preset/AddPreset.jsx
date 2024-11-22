import PropTypes from "prop-types";
import usePresetStore from "../../stores/PresetStore";
import { useEffect, useState } from "react";

function AddPreset({ onSave }) {
  const MIN_TITLE_LENGTH = 2;
  const MAX_TITLE_LENGTH = 8;

  const { presetList } = usePresetStore();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const isDuplicated = presetList.some((preset) => preset.title === title);
    const isInvalidLength =
      title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH;
    onSave(title, isDuplicated || isInvalidLength);
  }, [title, presetList, onSave]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex items-center gap-5 mb-2">
        <div className="text-[20px] font-bold ">생성할 프리셋명</div>
        <input
          id="title"
          name="title"
          value={title}
          placeholder="프리셋명"
          className="h-[40px] w-[200px] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333]"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="h-[40px] flex flex-col justify-center">
        {title.length < MIN_TITLE_LENGTH && (
          <div className="text-[#F40000]">
            프리셋명은 최소 2자 이상이어야 합니다.
          </div>
        )}
        {title.length > MAX_TITLE_LENGTH && (
          <div className="text-[#F40000]">
            프리셋명은 최대 8자까지 가능합니다.
          </div>
        )}
        {presetList.some((preset) => preset.title === title) && (
          <div className="text-[#F40000]">중복된 프리셋명이 존재합니다.</div>
        )}
      </div>
    </div>
  );
}

AddPreset.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default AddPreset;
