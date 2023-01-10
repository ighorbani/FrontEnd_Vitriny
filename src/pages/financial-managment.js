import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "../components/backdrop";
import FooterMenu from "../components/footer-menu";
import AdminMessageModal from "../modals/admin-message";

function FinancialManagmentPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const availableUser = useSelector((state) => state.user);
  const [financialStatement, setFinancialStatement] = useState();
  const [financialEvidences, setFinancialEvidences] = useState();
  const [noFactor, setNoFactor] = useState(false);
  const [notAccepted, setNotAccepted] = useState(false);
  const [businessName, setBusinessName] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminModalInfo, setAdminModalInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchFinancialStatement() {
    setError(null);
    setIsLoading(true);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/calculateBusinessFinancial/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setFinancialStatement(data.financialStatement);
        setNoFactor(false);
      } else if (data.state === "NotAccepted") {
        setNotAccepted(true);
        setBusinessName(data.businessName);
        setFinancialEvidences(data.financialInformation);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchFinancialStatement();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  function closeModal() {
    setShowAdminModal(false);
  }

  function toggleAdminModal() {
    setShowAdminModal((prevState) => !prevState);
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

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  if (notAccepted) {
    return (
      <>
        {/* FLASH MESSAGE */}
        <Transition
          in={showAdminModal}
          timeout={1000}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <>
              <AdminMessageModal
                info={adminModalInfo}
                show={state}
                hideMessage={closeModal}
              />
              <Backdrop clicked={closeModal} show={state} />
            </>
          )}
        </Transition>
        <div className="chats-page-cnt">
          <div className="top-menu-name financial-managment-page">
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="comment-product-page-title">
              <h2>گزارشات مالی</h2>
              <h5>{businessName}</h5>
            </div>
          </div>
          <div style={{ paddingTop: "5rem" }}>
            <div className="icon-title">
              <div className="icon factor">
                <div>
                  <span></span>
                </div>
              </div>

              {financialEvidences?.sentForReview === true ? (
                <>
                  <h2>در حال بررسی اطلاعات</h2>
                  <p>
                    اطلاعات شما برای بازکردن حساب مالی ارسال شده است. این
                    اطلاعات بازبینی و نتیجه آن به اطلاع شما خواهد رسید.
                  </p>
                </>
              ) : financialEvidences?.sentForReview === true ? (
                <>
                  <h2>اطلاعات شما پذیرفته نشد!</h2>
                  <p>
                    متاسفانه اطلاعات ارسالی شما برای بازکردن حساب مالی پذیرفته
                    نشد. برای مشاهده پیام مدیریت دکمه زیر را لمس کنید.
                  </p>
                </>
              ) : (
                <>
                  <h2>حساب مالی شما فعال نیست!</h2>
                  <p>
                    در حال حاضر امکان فروش آنلاین در ویترینی فعال نیست. پس از
                    اینکه تعداد کاربران به 20 هزار رسید، این قابلیت برای
                    بیزینس ها فعال خواهد شد.
                  </p>
                </>
              )}
            </div>

            {!financialEvidences?.accepted &&
              financialEvidences?.hasAdminMessage && (
                <div
                  onClick={toggleAdminModal}
                  className="button black"
                  style={{ marginTop: "4rem" }}
                >
                  مشاهده پیام ادمین
                </div>
              )}

            {/* {!financialEvidences?.sentForReview &&
              !financialEvidences?.accepted && (
                <Link style={{marginTop:"5rem"}} to="/requestBusinessPaymentForm" className="button green">
                  درخواست امکان فروش آنلاین
                </Link>
              )} */}
          </div>
          <FooterMenu />
        </div>
      </>
    );
  }

  function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return val;
  }

  return (
    <>
      {financialStatement && (
        <>
          <div className="top-menu-name financial-managment-page">
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="comment-product-page-title">
              <h2>مدیریت حساب مالی</h2>
              <h5>{financialStatement.businessName}</h5>
            </div>
          </div>

          <div className="financial-managment-cnt">
            <div className="financial-managment-state">
              <div className="state-icon">
                <div>
                  <span></span>
                </div>
              </div>
              <h2>حساب دریافتی ها</h2>
              <div className="financial-states">
                <div className="invoice-item">
                  <h5>ماه اخیر</h5>
                  <div className="invoice-item-flx">
                    <div className="i">
                      <h3>تعداد فاکتورها</h3>
                      <span>{financialStatement.lastMInvoices} عدد</span>
                    </div>
                    <div className="i">
                      <h3>فاکتورهای پرداخت شده</h3>
                      <span>{financialStatement.lastMPayedInvoices} عدد</span>
                    </div>
                    <div className="i">
                      <h3>درآمد ماه اخیر</h3>

                      <span>
                        {" "}
                        {commaSeparateNumber(
                          financialStatement.lastMIncome
                        )}{" "}
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                <div className="invoice-item">
                  <h5>کل مدت فعالیت</h5>
                  <div className="invoice-item-flx">
                    <div className="i">
                      <h3>تعداد فاکتورها</h3>
                      <span>{financialStatement.totalInvoices} عدد</span>
                    </div>
                    <div className="i">
                      <h3>فاکتورهای پرداخت شده</h3>
                      <span>{financialStatement.totalPayedInvoices} عدد</span>
                    </div>
                  </div>
                </div>

                <div className="i summary">
                  <h3>فروش کل</h3>
                  <span>
                    {" "}
                    {commaSeparateNumber(financialStatement.totalIncome)} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FinancialManagmentPage;
