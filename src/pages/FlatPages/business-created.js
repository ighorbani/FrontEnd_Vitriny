import { useParams, Link } from "react-router-dom";

function BusinessCreatedPage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon business">
            <div>
              <span></span>
            </div>
          </div>
          <h2>کسب و کار با موفقیت ثبت شد</h2>
          <p>
            اکنون میتوانید در صفحه کسب و کار محصولات، خدمات و سایر اطلاعات را
            اضافه کنید.
          </p>
        </div>

        <Link
          to={`/businessAdmin/${params.businessId}`}
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          بازگشت به کسب و کار
        </Link>
      </div>
    </>
  );
}

export default BusinessCreatedPage;
