import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import childrenApi from "../../api/childrenApi";
import { changeChildPasswordMessage } from "../../utils/Child/ChangeChildPassword";

function ChangePassword({ childId, setPasswordChange }) {
  const [childPassword, setChildPassword] = useState("");
  const [childConfirmPassword, setChildConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);

  const handleOnchange = (type, value) => {
    switch (type) {
      case "childPassword":
        setChildPassword(value);
        return;
      case "childConfirmPassword":
        setChildConfirmPassword(value);
        return;
      default:
        return;
    }
  };

  const handleChangePassword = () => {
    childrenApi
      .put(`/${childId}/password`, { childPassword, childConfirmPassword })
      .then(() => {
        Swal.fire(changeChildPasswordMessage());
        setChildPassword("");
        setChildConfirmPassword("");

        // 변경 후 컴포넌트 닫기
        setPasswordChange(false);
      })
      .catch((err) => Swal.fire(changeChildPasswordMessage(err)));
  };

  useEffect(() => {
    setPasswordCheck(childPassword === childConfirmPassword);
  }, [childPassword, childConfirmPassword]);

  return (
    <div className="flex justify-evenly absolute left-[25%]">
      <div className="flex flex-col gap-1">
        <input
          type="password"
          id="childPassword"
          name="childPassword"
          value={childPassword}
          placeholder="새로운 비밀번호"
          onChange={(e) => handleOnchange("childPassword", e.target.value)}
          className="h-[60%] w-[13vw] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
        />
        <input
          type="password"
          id="childConfirmPassword"
          name="childConfirmPassword"
          value={childConfirmPassword}
          placeholder="비밀번호 확인"
          onChange={(e) =>
            handleOnchange("childConfirmPassword", e.target.value)
          }
          className="h-[60%] w-[13vw] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
        />
        {!passwordCheck && (
          <div className="text-[#f40000] absolute top-[110%]">
            입력한 비밀번호가 일치하지 않습니다.
          </div>
        )}
      </div>
      <div className="flex gap-3 ms-5 h-[50%] self-end">
        <button
          onClick={handleChangePassword}
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
        >
          비밀번호 수정
        </button>
        <button
          onClick={() => setPasswordChange(false)}
          className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

// props validation 추가
ChangePassword.propTypes = {
  childId: PropTypes.number.isRequired,
  setPasswordChange: PropTypes.func.isRequired,
};

export default ChangePassword;
