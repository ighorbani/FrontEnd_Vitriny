function ImagePreview(props) {
  const imagePreviewClasses = [
    "image-preview",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <>
      <div onClick={props.hideImagePreview} className={imagePreviewClasses.join(" ")}>
        <img src={props.image} />
        <div className="image-description">{props.description}</div>
      </div>
    </>
  );
}

export default ImagePreview;
