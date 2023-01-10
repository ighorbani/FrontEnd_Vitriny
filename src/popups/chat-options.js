import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function ChatOptionsPopup(props) {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const [business, setBusiness] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const popupClasses = [
    "popup simple-option-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  async function fetchMyBusiness() {
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/getMyBusiness", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }
      const data = await response.json();
      if (data.state === "Ok") {
        setBusiness(data.business);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMyBusiness();
  }, []);

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>گزینه های کاربر</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options" style={{ padding: "0 2rem" }}>
          {business?.businessInfo.slug &&
            business?.financialInformation.accepted && (
              <div className="option" onClick={props.userFactors}>
                <h4>ایجاد فاکتور فروش برای کاربر</h4>
              </div>
            )}

          <div className="option" onClick={props.blockUser}>
            {props.blocking ? <h4>رفع بلاک</h4> : <h4>بلاک کردن</h4>}
          </div>
          <div className="option" onClick={props.reportChat}>
            <h4>گزارش چت</h4>
          </div>
          {/* <div className="option" onClick={props.deleteChat}>
            <h4>حذف چت</h4>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default ChatOptionsPopup;
