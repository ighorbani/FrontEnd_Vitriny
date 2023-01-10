function ReactionButton(props) {
  const buttonClasses = [
    props.ownClass,
    props.state === "entering"
      ? props.inClass
      : props.show === "exiting"
      ? props.outClass
      : null,
  ];

  return <div className={buttonClasses.join(" ")}></div>;
}

export default ReactionButton;
