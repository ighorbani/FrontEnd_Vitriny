import { useParams, Link } from "react-router-dom";

function OptionWithIcon(props) {
  return (
    <Link to={props.link} className="option">
      <div className="option-icon-name">
        <div className={"option-icon " + props.iconClass}></div>
        <h4>{props.title}</h4>
      </div>
      <div className="option-chev-noty">
        {props.notification.active && (
          <div className="notification">
            <span>{props.notification.value}</span>
          </div>
        )}
        <div className="chev-icon"></div>
      </div>
    </Link>
  );
}

export default OptionWithIcon;
