import { useNavigate } from "react-router-dom";

function StatisticPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div>StatisticPage</div>
      <button onClick={goBack}>돌아가기</button>
    </>
  );
}

export default StatisticPage;
