import { Link } from "react-router-dom";

function OptionsMenu(props) {
  const flashClasses = [
    "options-menu",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  const backdropClasses = [
    "backdrop",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <>
      <div className={flashClasses.join(" ")}>
        <cite></cite>

        {props.options.map((option, index) => (
          <Link to={option.link} key={index}>
            {option.title}
          </Link>
        ))}
      </div>
    </>
  );
}

export default OptionsMenu;
