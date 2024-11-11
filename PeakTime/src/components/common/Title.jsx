import PropTypes from "prop-types";

const Title = ({ title }) => {
  return (
    <div className="relative left-[12vw] top-[5vh] w-[84vw] h-[4rem] p-5 bg-[#333333] bg-opacity-70 text-[3rem] text-white mb-[2vh] flex justify-center items-center">
      <p>{title}</p>
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
