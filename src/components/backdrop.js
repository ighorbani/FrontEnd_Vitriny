function Backdrop(props) {
  const backdropClasses = [
    "backdrop",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <div className={backdropClasses.join(" ")} onClick={props.clicked}></div>
  );
}

export default Backdrop;
