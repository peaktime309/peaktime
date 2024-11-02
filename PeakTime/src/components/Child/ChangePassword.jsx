import PropTypes from "prop-types";

function ChangePassword({ childId }) {
  return <div>{childId} 번째 차일드 ChangePassword</div>;
}
// props validation 추가
ChangePassword.propTypes = {
  childId: PropTypes.number.isRequired,
};
export default ChangePassword;
