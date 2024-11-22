import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function AddProgram({ blockProgramArray, onAddProgram }) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isInvalidProcess, setIsInvalidProcess] = useState(false); // 프로세스로 넣기
  const [isFileMode, setIsFileMode] = useState(true); // 입력 방식 토글 상태
  const [isExeName, setIsExeName] = useState(false); // 입력 방식 토글 상태

  const [newProgram, setNewProgram] = useState("");

  // 파일명 검사
  const checkExeFile = (name) => {
    return /\.exe$/i.test(name);
  };

  // 파일 선택시 처리하기
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && checkExeFile(file.name)) {
      const processName = file.name; // 파일명(프로세스명) 가져오기
      setNewProgram(processName);
      setIsInvalidProcess(false);
    } else {
      setNewProgram("");
      setIsInvalidProcess(true);
    }
  };

  // 입력 방식 토글 버튼 클릭 시 처리
  const toggleInputMode = () => {
    setIsFileMode((mode) => !mode);
    setNewProgram("");
    setIsInvalidProcess(false);
  };

  useEffect(() => {
    setIsDuplicate(blockProgramArray.includes(newProgram));
    setIsEmpty(!newProgram);
    setIsExeName(!/\.exe$/i.test(newProgram));
    onAddProgram(
      newProgram,
      isDuplicate || isEmpty || isInvalidProcess || isExeName
    );
  }, [
    newProgram,
    isDuplicate,
    isEmpty,
    isExeName,
    blockProgramArray,
    onAddProgram,
  ]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-around items-center gap-5 mb-10 w-full">
        <div className="flex flex-col justify-center w-[35%]">
          <div className="flex justify-center gap-2">
            <button
              className={`text-[18px] ${
                isFileMode
                  ? "bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                  : "bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
              }`}
              onClick={() => setIsFileMode(true)}
            >
              파일 선택
            </button>
            <button
              className={`px-4 py-2 text-[18px] font-bold rounded-lg ${
                !isFileMode
                  ? "bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                  : "bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
              }`}
              onClick={() => setIsFileMode(false)}
            >
              직접 입력
            </button>
          </div>
        </div>

        <div className="w-[65%]">
          {/* 직접 입력 모드 */}
          {!isFileMode ? (
            <div>
              <input
                id="site"
                name="site"
                value={newProgram}
                placeholder=".exe 형식으로 작성하세요"
                className="h-[40px] w-full rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333] placeholder:text-base"
                onChange={(e) => setNewProgram(e.target.value)}
              />
              <div
                className="absolute top-[50%] right-[10%] text-xs text-[#03C777]"
                style={{ whiteSpace: "pre-line" }}
              >
                {`( 파일 > 속성 > 바로가기 > 대상 )\n마지막 .exe 파일명을 확인하세요`}
              </div>
            </div>
          ) : (
            <input
              type="file"
              accept=".exe"
              className="block h-[40px] w-full bg-[#f0f0f0] rounded-lg focus:outline-none text-[#333333] text-left file:rounded-lg file:text-sm"
              onChange={handleFileSelect}
            />
          )}
        </div>
      </div>

      <div className="h-[40px] flex flex-col justify-center">
        {isExeName && !isFileMode && (
          <div className="text-[#F40000]">입력한 형식이 .exe가 아닙니다.</div>
        )}
        {/* {isEmpty && (
          <div className="text-[#F40000]">차단할 프로그램을 입력해주세요.</div>
        )} */}
        {isDuplicate && (
          <div className="text-[#F40000]">중복된 프로그램이 존재합니다.</div>
        )}
        {/* {!isInvalidProcess && newProgram && !isDuplicate && !isEmpty && (
          <div className="text-white">선택된 프로그램명: {newProgram}</div>
        )} */}
      </div>
    </div>
  );
}

AddProgram.propTypes = {
  blockProgramArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddProgram: PropTypes.func.isRequired,
};

export default AddProgram;
