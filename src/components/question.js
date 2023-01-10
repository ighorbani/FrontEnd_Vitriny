function Question(props) {
  const flashClasses = [
    "question-box",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <div className="question-box" className={flashClasses.join(" ")}>
      <div className="flash-close" onClick={props.closePrompt}>
        <div></div>
      </div>
      <h4>{props.title}</h4>
      <p>{props.message}</p>
      <div className="question-btns">
        <div className="green" onClick={props.promptProceed}>{props.accept}</div>
        <div className="black" onClick={props.closePrompt}>
          {props.reject}
        </div>
      </div>
    </div>
  );
}

export default Question;
