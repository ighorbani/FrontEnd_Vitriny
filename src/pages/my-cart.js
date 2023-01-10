import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";

function MyCartPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [noBuy, setNoBuy] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchMyFactors() {
    setError(null);
    setIsLoading(true);
    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getUserInvoices/", {
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setInvoices(data.invoices);
        setNoBuy(false);
      } else if (data.state === "No") {
        setNoBuy(true);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchMyFactors();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function SeeFactorHandler(invoiceId) {
    history.push({
      pathname: "/invoiceSingle",
      state: {
        invoiceId: invoiceId,
      },
    });
  }

  
  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond ">
            <div>
              <span className="loading-rotate"></span>
            </div>
          </div>
        </div>
        <div className="animated-fillbar">
          <h5>لطفا منتظر باشید...</h5>
          <p>در حال دریافت اطلاعات</p>
          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (noBuy) {
    return (
      <div className="chats-page-cnt">
        <div className="top-menu-name my-cart-page">
          <div onClick={history.goBack} className="back-menu"></div>
          <div className="comment-product-page-title">
            <h2>خریدهای من</h2>
          </div>
        </div>
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon cart">
              <div>
                <span></span>
              </div>
            </div>
            <h2>موردی یافت نشد!</h2>
            <p>شما هنوز هیچ سفارش و خریدی نداشته اید.</p>
          </div>
        </div>
        <FooterMenu />
      </div>
    );
  }

  return (
    <>
      <div className="top-menu-name my-cart-page">
        <>
          <div onClick={history.goBack} className="back-menu"></div>
          <div className="comment-product-page-title">
            <h2>خریدهای من</h2>
          </div>
        </>
      </div>
      <div className="my-cart-cnt">
        {invoices.length &&
          invoices.map((invoice, index) => (
            <div
              onClick={SeeFactorHandler.bind(this, invoice._id)}
              key={index}
              className={
                "factor-item " + (invoice.invoiceInfo.payed ? "payed" : "")
              }
            >
              <div className="number">{invoice.invoiceInfo.number}</div>
              <div className="img">
                <div></div>
              </div>
              <div className="cnt">
                <h4>{invoice.items[0].name}</h4>
                <h5 className="factor-price-name">
                  <span>{invoice.items[0].price} تومان</span>
                  <span>
                    {invoice.forUser.userInfo.name.length < 8
                      ? invoice.forUser.userInfo.name
                      : invoice.forUser.userInfo.name.substring(0, 8) + " ..."}
                  </span>
                </h5>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default MyCartPage;
