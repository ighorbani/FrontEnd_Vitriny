import OptionWithIcon from "../components/option-with-icon";
import { useParams, Link } from "react-router-dom";

function BusinessOptionsPopup(props) {
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
          <h2>گزینه ها</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options">
          <div className="option" onClick={props.activateHandler}>
            {props.activateState === false ? (
              <h4>غیرفعال کردن کسب و کار</h4>
            ) : (
              <h4>فعال کردن کسب و کار</h4>
            )}
          </div>

          <div className="option" onClick={props.addToInsta}>
              <h4>لینک به صفحه اینستاگرام</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessOptionsPopup;
