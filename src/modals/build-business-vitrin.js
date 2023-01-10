import { useParams, Link } from "react-router-dom";

function BuildBusinessVitrin(props) {
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
          <h3>شبکه اجتماعی ویترینی</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>ویترینی برای پست هایتان</h2>
            <p style={{ padding: "0 2rem" }}>
              پست هایتان را در ویترینی به رایگان به اشتراک بگذارید!
            </p>
          </div>

          <div className="modal-container-cnt">
            <div className="modal-image instagram-link"></div>
            <h4 className="sec-title green">فروش من فقط با حضور گرم شما</h4>
            <p className="description-p dashed">
              صفحه کسب و کارت رو بساز، شماره تلفن، شبکه های اجتماعی، موقعیت روی
              نقشه و ... رو اضافه کن! محصولاتت رو هم با تصویر و قیمت بیار! حالا
              این صفحه رو به اینستاگرامت لینک کن تا تموم دنبال کننده هات،
              اطلاعات کامل کار و محصولاتت رو در اختیار داشته باشن!
            </p>
            <h4 className="sec-title green">
              قابلیت چت و امکان جستجو بر اساس شهر
            </h4>
            <p className="description-p dashed">
              علاوه بر صفحه سازی آنلاین، امکان قابلیت چت با مشتریات رو داری؛
              علاوه بر اون بیزینس ات رو اینجا ثبت کنی، همشهری هات هم میتونن
              ببینن و ازت خرید کنن!
            </p>

            <Link to="/registerBusiness" className="button">
              ساخت صفحه شخصی!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuildBusinessVitrin;
