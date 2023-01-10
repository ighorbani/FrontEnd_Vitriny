import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";

function UserChatFactors(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [noFactor, setNoFactor] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchFactors() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getUserBusinessInvoices/", {
        method: "POST",
        body: JSON.stringify({
          forUserId: props.location.state.userId,
        }),
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
        setNoFactor(false);
      } else if (data.state === "No") {
        setNoFactor(true);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFactors();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  function SeeFactorHandler(invoiceId) {
    history.push({
      pathname: "/invoiceSingle",
      state: {
        invoiceId: invoiceId,
      },
    });
  }

  if (noFactor) {
    return (
      <div className="chats-page-cnt">
        <div className="top-menu-name user-factors-managment-page">
          <div onClick={history.goBack} className="back-menu"></div>
          <div className="comment-product-page-title">
            <h2>فاکتورهای فروش</h2>
            <h5>{props.location.state.userName}</h5>
          </div>
        </div>
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon factor">
              <div>
                <span></span>
              </div>
            </div>
            <h2>فاکتوری یافت نشد</h2>
            <p>شما هنوز برای این مشتری هیچ فاکتور فروشی ایجاد نکرده اید.</p>
          </div>

          <Link
            to={{
              pathname: "/addFactor",
              state: {
                userName: props.location.state.userName,
                userId: props.location.state.userId,
              },
            }}
            className="button green"
            style={{ marginTop: "4rem" }}
          >
            ایجاد فاکتور فروش
          </Link>
        </div>
        <FooterMenu paddingBG={false} />
      </div>
    );
  }

  return (
    <>
      <div className="top-menu-name user-factors-managment-page">
        <div onClick={history.goBack} className="back-menu"></div>
        <div className="comment-product-page-title">
          <h2>فاکتورهای فروش</h2>
          <h5>{props.location.state.userName}</h5>
        </div>
      </div>
      <div className="factors-managment-cnt">
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
                  <span> {commaSeparateNumber(invoice.items[0].price)} تومان
                  </span>
                  <span>{invoice.items[0].unit}</span>
                </h5>
              </div>
            </div>
          ))}
        <Link
          to={{
            pathname: "/addFactor",
            state: {
              userName: props.location.state.userName,
              userId: props.location.state.userId,
            },
          }}
          className="button green"
          style={{ marginTop: "4rem" }}
        >
          ایجاد فاکتور فروش
        </Link>
      </div>

      <FooterMenu paddingBG={true} />
    </>
  );
}

export default UserChatFactors;
