import { useParams, Link } from "react-router-dom";
import React, { useState } from "react";

function FilterCategory(props) {


  const [phoneInfo, setPhoneInfo] = useState();







  const popupClasses = [
    "popup filter-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div class="popup-top">
          <h2>فیلتر</h2>
          <span>پاک کردن تمامی موارد</span>
        </div>

        <div class="filters-cnt">
          <div class="filter-item-switch">
            <h4>فقط موارد رنگ دار</h4>
            <div class="filter-switch active">
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <div class="filter-item-switch">
            <h4>فقط موارد رنگ دار</h4>
            <div class="filter-switch">
              <div>
                <span></span>
              </div>
            </div>
          </div>
          <div class="filter-item-collapsible">
            <div class="filter-collapse">
              <h4>فقط موارد رنگ دار</h4>
              <div class="collapse-icon"></div>
            </div>
            <div class="filter-collapse-cnt">
              <div class="filter-choices-cnt">
                <div class="filter-choice">آبی</div>
                <div class="filter-choice active">آبی</div>
                <div class="filter-choice">آبی</div>
              </div>
            </div>
          </div>
          <div class="button green">اعمال کن!</div>
        </div>
      </div>
    </>
  );
}

export default FilterCategory;
