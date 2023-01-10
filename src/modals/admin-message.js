import { useParams, Link } from "react-router-dom";

function AdminMessageModal(props) {
  const modalClasses = [
    "modal-container",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  return (
    <>
      <div className={modalClasses.join(" ")}>
        <div className="modal-top">
          <h3>{props.info.title}</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className={"icon " + props.info.icon}>
              <div>
                <span></span>
              </div>
            </div>
            <h2>{props.info.iconTitle}</h2>
            <p style={{ padding: "0 2rem" }}>{props.info.iconParagraph}</p>
          </div>

          <div className="modal-container-cnt">
            {props.image && (
              <div
                className="modal-image"
                tyle={{ backgroundImage: `url(${props.image})` }}
              ></div>
            )}
            {props.info.secondTitle && (
              <h4 className="sec-title green">{props.info.secondTitle}</h4>
            )}

            <p className="description-p dashed">{props.info.secondParagraph}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminMessageModal;
