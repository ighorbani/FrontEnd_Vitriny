import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";
import moment from "jalali-moment";

function InvoiceSinglePage(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [invoice, setInvoice] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchFactor() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getInvoice/"+ props.location.state.invoiceId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setInvoice(data.invoice);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFactor();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  return (
    <>
      <div className="top-menu-name financial-managment-page">
        <>
          <div onClick={history.goBack} className="back-menu"></div>

          {invoice && (
            <div className="comment-product-page-title">
              <h2>مشخصات فاکتور</h2>
              <h5>{invoice.businessName}</h5>
            </div>
          )}
        </>
      </div>

      <div className="financial-managment-cnt">
        {invoice && !invoice.forMe && (
          <div
            className={
              "financial-managment-state " + (invoice.payed ? "payed" : "")
            }
          >
            <div className="state-icon">
              <div>
                <span></span>
              </div>
            </div>
            <h2>فاکتور {invoice.invoiceNumber}</h2>
            <div className="financial-states">
              <div className="i">
                <h3>وضعیت پرداخت</h3>
                <span className="payment-status">
                  {invoice.payed ? "پرداخت شده" : "پرداخت نشده"}
                </span>
              </div>
              <div className="i">
                <h3>تاریخ ایجاد</h3>
                <span className="date">
                  {moment(invoice.date)
                    .locale("fa")
                    .format("YYYY / MM / DD")}
                </span>
              </div>
              <div className="i">
                <h3>نام کاربر</h3>
                <span>{invoice.userName}</span>
              </div>
              <div className="i" style={{ borderBottom: "none" }}>
                <h3>کد کاربر</h3>
                <span>{invoice.userSlug}</span>
              </div>

              <div className="invoice-item">
                <h5>مورد فروش</h5>
                <div className="invoice-item-flx">
                  <div className="i">
                    <h3>عنوان</h3>
                    <span>{invoice.itemName}</span>
                  </div>
                  <div className="i">
                    <h3>واحد</h3>
                    <span>{invoice.unit}</span>
                  </div>
                  <div className="i">
                    <h3>قیمت</h3>
                    <span>{commaSeparateNumber(invoice.itemPrice)} تومان</span>
                  </div>
                  
                  <div className="i">
                    <blockquote>{invoice.description}</blockquote>
                  </div>
                </div>
              </div>

              <div className="i summary">
                <h3>مبلغ کل</h3>
                <span>{commaSeparateNumber(invoice.totalPrice)} تومان</span>
              </div>
              
            </div>
          </div>
        )}
        {invoice && !invoice.forMe && !invoice.payed && (
          <div className="invoice-ctas">
            <Link
              to={{
                pathname: "/addFactor",
                state: {
                  // userName: props.location.state.userName,
                  // userId: props.location.state.userId,
                },
              }}
              className="button green"
            >
              ارسال مجدد برای کاربر
            </Link>

            <Link
              to={{
                pathname: "/addFactor",
                state: {
                  invoiceId: props.location.state.invoiceId,
                  userId: props.location.state.userId,
                },
              }}
              className="button green-outline"
            >
              ویرایش
            </Link>
          </div>
        )}

        {invoice && invoice.forMe && (
          <>
            <div className="icon-title" style={{ marginTop: "-2rem" }}>
              <div className="icon invoice">
                <div>
                  <span></span>
                </div>
              </div>
              <h2>{invoice.itemName}</h2>
              <p>{invoice.businessName}</p>
            </div>

            <div className="invoice">
              <div className="invoice-row">
                <h5>محصول</h5>
                <span>{invoice.itemName}</span>
              </div>

              <div className="invoice-row">
                <h5>قیمت</h5>
                <span>{commaSeparateNumber(invoice.itemPrice)} تومان</span>
              </div>
              
              <div className="invoice-row">
                <h5>واحد</h5>
                <span>{invoice.unit}</span>
              </div>

              <div className="invoice-row">
                <h5>شماره فاکتور</h5>
                <span>{invoice.invoiceNumber}</span>
              </div>
            </div>

            <Link to="" className="button">
              پرداخت {commaSeparateNumber(invoice.totalPrice)} تومان
            </Link>         
          </>
        )}
      </div>
    </>
  );
}

export default InvoiceSinglePage;
