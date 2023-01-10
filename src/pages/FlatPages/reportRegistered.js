import { useParams, Link } from "react-router-dom";

function ReportRegistered() {
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon success">
            <div>
              <span></span>
            </div>
          </div>
          <h2>گزارش با موفقیت ثبت شد</h2>
          <p>
            از توجه شما سپاسگزاریم. نظر شما برای ما ارزشمند است و به آن رسیدگی
            میکنیم.
          </p>
        </div>

        <Link to="/" className="button green-outline">
          رفتن به صفحه خانه
        </Link>
      </div>
    </>
  );
}

export default ReportRegistered;
