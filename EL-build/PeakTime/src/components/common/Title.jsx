import PropTypes from "prop-types";

function Title({ title }) {
  return (
    <div className="w-[89vw] h-[10vh] ms-[11vw] pt-[3vh] text-[40px] font-bold text-start text-white">
      {title}
    </div>
  );
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
