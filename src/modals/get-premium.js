import { useParams, Link } from "react-router-dom";

function GetPremiumModal(props) {
  const params = useParams();

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
          <h3>پرمیوم یکساله ویترینی!</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>پرمیوم شو!</h2>
            <p style={{ padding: "0 2rem" }}>
              به مدت یکسال از امکانات پرمیوم ویترینی استفاده کنید!
            </p>
          </div>

          <div className="modal-container-cnt">
            <h4 className="sec-title green">با مشتریانتان گفتگو کنید</h4>
            <p className="description-p dashed">
              برای ثبت کسب و کار در ابتدا باید خودتان ثبت نام کنید.
            </p>

            <h4 className="sec-title green">هر روز استوری بگذارید</h4>
            <p className="description-p dashed">
              برای ثبت کسب و کار در ابتدا باید خودتان ثبت نام کنید.
            </p>

            <h4 className="sec-title green">با مشتریانتان گفتگو کنید</h4>
            <p className="description-p dashed">
              برای ثبت کسب و کار در ابتدا باید خودتان ثبت نام کنید.
            </p>

            <Link to={`/invoice/${params.businessId}`} className="button">پرمیوم شو!</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default GetPremiumModal;
