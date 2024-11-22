import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function AddSite({ blockWebsiteArray, onAddSite }) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [newSite, setNewSite] = useState("");

  useEffect(() => {
    setIsDuplicate(blockWebsiteArray.includes(newSite));
    setIsEmpty(!newSite);
    onAddSite(newSite, isDuplicate || isEmpty);
  }, [newSite, isDuplicate, isEmpty, blockWebsiteArray, onAddSite]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-around items-center gap-5 mb-2 w-full">
        <div className="text-[20px] font-bold ">차단할 사이트명</div>
        <input
          id="site"
          name="site"
          value={newSite}
          placeholder="차단할 사이트명"
          className="h-[40px] w-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3 text-[#333333]"
          onChange={(e) => setNewSite(e.target.value)}
        />
      </div>
      <div className="h-[40px] flex flex-col justify-center">
        {isEmpty && (
          <div className="text-[#F40000]">
            차단할 사이트 URL을 입력해야 합니다.
          </div>
        )}
        {isDuplicate && (
          <div className="text-[#F40000]">중복된 사이트 URL이 존재합니다.</div>
        )}
      </div>
    </div>
  );
}

AddSite.propTypes = {
  blockWebsiteArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddSite: PropTypes.func.isRequired,
};

export default AddSite;
