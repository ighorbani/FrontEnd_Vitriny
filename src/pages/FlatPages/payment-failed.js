import { useParams, Link } from "react-router-dom";
function PaymentFailedPage() {
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
          <h2>پرداخت با موفقیت انجام نشد!</h2>
          <p>لطفا برای بازگشت به صفحه اصلی روی دکمه زیر کلیک کنید.</p>
        </div>

        <Link
          to={`/businessAdmin/${businessId}`}
          className="button red-outline"
          style={{ marginTop: "10rem" }}
        >
          بازگشت به کسب و کار
        </Link>
      </div>
    </>
  );
}

export default PaymentFailedPage;
