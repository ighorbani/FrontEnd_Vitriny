import { useParams, Link } from "react-router-dom";

function TermsConditions(props) {
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
          <h3>حریم خصوصی</h3>
          <div className="modal-close" onClick={props.modalClose}></div>
        </div>
        <div className="modal-scrollable" style={{ paddingTop: "7rem" }}>
          <div className="modal-container-cnt" style={{ paddingTop: "0" }}>
            {/* <h4 className="sec-title green" style={{ marginTop: "0" }}>
              حفظ حریم خصوصی
            </h4> */}
            <p className="description-p dashed">
              برای ثبت نام در اپلیکشین و وب سایت ویترینی لازم است تا اطلاعاتی
              مانند نام و تلفن همراه خود را در اختیار ما قرار دهید. در صورت
              تمایل میتوانید برای تکمیل پروفایل خود تصویر خود را نیز بارگزاری
              نمایید. نگرانی بسیاری از کاربران، محفوظ ماندن اطلاعات شخصی همچنین
              شماره همراه و نام است که برای ثبت نام و ورود به ما می‌سپارند. باید
              گفت ما نیز اهمیت این موضوع را درک می‌کنیم و حریم خصوصی کاربران
              برای ما اهمیت بسیاری دارد.
            </p>
            <div
              style={{ margin: 0 }}
              onClick={props.modalClose}
              className="button"
            >
              بستن
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TermsConditions;
