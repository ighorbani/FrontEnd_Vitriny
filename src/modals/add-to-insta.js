import { useParams, Link } from "react-router-dom";

function AddToInsta(props) {
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
          <h3>لینک به صفحه اینستاگرام</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>مشتریای اینستاتو بیار!</h2>
            <p style={{ padding: "0 2rem" }}>
              ویترین کسب و کارت رو به مشتریان اینستاگرام ات معرفی کن!
            </p>
          </div>

          <div className="modal-container-cnt">
            <div className="modal-image instagram-link"></div>
            <h4 className="sec-title green">
              قراردادن لینک در صفحه اینستاگرام
            </h4>
            <p className="description-p dashed">
              لینک ویترین کسب و کارت رو تو صفحه اینستاگرامی خودت قرار بده تا
              مشتریانت بتونن بدون فیلتر با کسب و کارت تو ویترینی در ارتباط باشن.
            </p>

            <div onClick={props.copyLink} className="button">
              کپی آدرس کسب و کارت
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddToInsta;
