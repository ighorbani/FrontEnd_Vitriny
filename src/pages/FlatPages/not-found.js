import { useParams, Link } from "react-router-dom";
function NotFound() {
  const businessId = "";
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon under-construction">
            <div>
              <span></span>
            </div>
          </div>
          <h2>یافت نشد!</h2>
          <p>متاسفانه صفحه درخواستی شما یافت نشد!</p>
        </div>

        <Link
          to="/"
          className="button green-outline"
          style={{ marginTop: "4rem" }}
        >
          بازگشت به خانه
        </Link>
      </div>
    </>
  );
}

export default NotFound;
