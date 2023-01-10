function FlashMessage(props) {
  const flashClasses = [
    "flash-message",
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
        <div className="flash-close" onClick={props.hideMessage}>
          <div></div>
        </div>
        <p>{props.message}</p>
      </div>
      <div
        className={backdropClasses.join(" ")}
        onClick={props.hideMessage}
      ></div>
    </>
  );
}

export default FlashMessage;
