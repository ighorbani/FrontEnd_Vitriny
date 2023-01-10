import { useParams, Link } from "react-router-dom";

function PaymentSuccedPage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon success">
            <div>
              <span></span>
            </div>
          </div>
          <h2>پرداخت با موفقیت انجام شد!</h2>
          <p>
           پرداخت شما برای پتوی گلبافت، فروشگاه اطلس با موفقیت انجام شد.
          </p>
        </div>

        <div className="invoice success">
          <div className="invoice-row">
            <h5>محصول</h5>
            <span>پتوی گلبافت 6 متری</span>
          </div>

          <div className="invoice-row">
            <h5>مبلغ پرداخت شده</h5>
            <span>120.000 تومان</span>
          </div>

          <div className="invoice-row">
            <h5>کسب و کار</h5>
            <span>فروشگاه اطلس</span>
          </div>
        </div>

        <Link
          to="/"
          className="button green-outline"
        >
          بازگشت به خانه
        </Link>
      </div>
    </>
  );
}

export default PaymentSuccedPage;
