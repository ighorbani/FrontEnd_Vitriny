import { Link } from "react-router-dom";

function FlatOptions(props) {
  const flashClasses = [
    "flat-options",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <>
      <div className={flashClasses.join(" ")}>
        <pre>
          <blockquote>گزینه ها</blockquote>
          <span onClick={props.popupClose}></span>
        </pre>
        {props.buttons.map((button, index) => (
          <div
            className={button.cssClass ? button.cssClass : ""}
            onClick={button.action}
            key={index}
          >
            {button.title}
          </div>
        ))}
      </div>
    </>
  );
}

export default FlatOptions;
