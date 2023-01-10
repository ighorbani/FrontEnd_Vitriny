import { useParams, Link } from "react-router-dom";
import React, { useState } from "react";

function FilterCategory(props) {
  const [filterRegions, setFilterRegions] = useState([]);
  const [filterSaved, setFilterSaved] = useState(false);

  function ResetFilters() {
    setFilterRegions([]);
    setFilterSaved(false);
  }

  const popupClasses = [
    "popup filter-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  function RegionsHandler(region) {
    if (filterRegions.includes(region)) {
      const newRegionsArray = filterRegions.filter(region);
      setFilterRegions(newRegionsArray);
    } else {
      const newRegionsArray = [...filterRegions, region];
      setFilterRegions(newRegionsArray);
    }
  }

  function ToggleSwitchHandler() {
    setFilterSaved((prevState) => !prevState);
  }

  const switchClass = ["filter-switch", filterSaved && "active"];

  function SetRegionsClass(region) {
    let regionsClass = [
      "filter-choice",
      filterRegions.includes(region) ? "active" : "",
    ];
    return regionsClass.join(" ");
  }

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>فیلتر</h2>
          <span onClick={ResetFilters}>پاک کردن تمامی موارد</span>
        </div>

        <div className="filters-cnt">
          <div className="filter-item-switch">
            <h4>نمایش موارد فالو شده</h4>
            <div class={switchClass.join(" ")} onClick={ToggleSwitchHandler}>
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <div className="filter-item-collapsible">
            <div className="filter-collapse">
              <h4>جستجو فقط در این مناطق</h4>
              <div className="collapse-icon"></div>
            </div>
            <div className="filter-collapse-cnt">
              <div className="filter-choices-cnt">
                {props.regionOptions.map((region, index) => (
                  <div
                    key={index}
                    className={SetRegionsClass(region)}
                    onClick={RegionsHandler.bind(this, region)}
                  >
                    {region}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="button green"
            onClick={props.onApply.bind(this, {
              regions: filterRegions,
              save: filterSaved,
            })}
          >
            اعمال کن!
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterCategory;
