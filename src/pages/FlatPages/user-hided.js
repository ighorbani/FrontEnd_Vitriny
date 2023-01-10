import { useParams, Link } from "react-router-dom";
function UserHidedPage() {
  const businessId = "";
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon failed">
            <div>
              <span></span>
            </div>
          </div>
          <h2>صفحه متوقف شده!</h2>
          <p>
            متاسفانه این صفحه به دلایلی متوقف است. برای بازگشت به صفحه
            خانگی کلیک کنید.
          </p>
        </div>

        <Link
          to="/"
          className="button red-outline"
          style={{ marginTop: "10rem" }}
        >
          بازگشت به خانه
        </Link>
      </div>
    </>
  );
}

export default UserHidedPage;
