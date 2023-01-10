import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function StoryOptionsPopup(props) {
  const popupClasses = [
    "popup simple-option-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>گزینه های این استوری</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options">
          <div className="option">
            <h4>حذف کردن</h4>
          </div>

          <div className="option">
            <h4>افزودن به کالکشن استوری ها</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryOptionsPopup;
