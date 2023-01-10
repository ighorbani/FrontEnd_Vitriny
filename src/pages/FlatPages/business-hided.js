import { useParams, Link } from "react-router-dom";
function BusinessHidedPage() {
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
          <h2>کسب و کار متوقف است</h2>
          <p>
            متاسفانه این کسب و کار به دلایلی متوقف است. برای بازگشت به صفحه
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

export default BusinessHidedPage;
