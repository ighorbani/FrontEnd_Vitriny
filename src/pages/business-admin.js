import GetPremiumModal from "../modals/get-premium";
import BusinessOptionsPopup from "../popups/business-options";
import React, { useEffect, useState } from "react";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import ProductPriceFeature from "../components/product-price-feature";
import GetProductModal from "../modals/get-product";
import FlashMessage from "../components/flash-message";
import { useHistory, useParams, Link } from "react-router-dom";
import FooterMenu from "../components/footer-menu";
import AddToInsta from "../modals/add-to-insta";
import { useSelector, useDispatch } from "react-redux";
import Mapir from "mapir-react-component";
import "mapir-react-component/dist/index.css";
import GoogleLocationPopup from "../popups/google-location";
import pinImage from "../assets/images/pin-background.png";

function BusinessAdminPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showGoogleLocationPopup, setShowGoogleLocationPopup] = useState(false);

  const [businessInfo, setBusinessInfo] = useState();
  const [modalProduct, setModalProduct] = useState();
  const [flashMessage, setFlashMessage] = useState("");
  const [modalHasNext, setModalHasNext] = useState();
  const [nextProductIndex, setNextProductIndex] = useState();
  const [activateStates, setActivateStates] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAddToInstaModal, setShowAddToInstaModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  const Map = Mapir.setToken({
    transformRequest: (url) => {
      return {
        url: url,
        headers: {
          "x-api-key": process.env.REACT_APP_MAP_API_URL,
          "Mapir-SDK": "reactjs",
        },
      };
    },
  });

  function GoEditBusinessPage() {
    history.push({
      pathname: "/editBusiness",
      state: {
        slug: params.slug,
      },
    });
  }

  function toggleOptionsPopup() {
    setShowOptionsPopup((prevState) => !prevState);
  }

  function toggleGoogleLocationPopup() {
    setShowGoogleLocationPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowOptionsPopup(false);
    setShowGoogleLocationPopup(false);
  }

  function showMessage() {
    setShowFlashMessage(true);

    const showMessageTimer = setTimeout(() => {
      setShowFlashMessage(false);
    }, 3000);

    return () => {
      clearTimeout(showMessageTimer);
    };
  }

  function hideFlashMessage() {
    setShowFlashMessage(false);
  }

  function togglePremiumModal() {
    setShowPremiumModal((prevState) => !prevState);
  }

  function toggleAddToInstaModal() {
    setShowAddToInstaModal((prevState) => !prevState);
    closePopup();
  }

  function toggleProductModal(product) {
    setModalProduct(product);
    let thisProductIndex = businessInfo.products.findIndex((p) => {
      return p == product;
    });

    let nextProductIndex= ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex< businessInfo.products.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowProductModal(true);
  }

  function nextModalProduct() {
    toggleProductModal(businessInfo.products[nextProductIndex]);
  }

  function closeModal() {
    setShowPremiumModal(false);
    setShowProductModal(false);
    setShowAddToInstaModal(false);
  }

  async function FetchBusiness() {
    setError(null);
    setIsLoading(true);
    const getBusinessAdminUrl =
      "http://localhost:8080/getBusinessAdmin/" + params.slug;

    try {
      // prettier-ignore
      const response = await fetch( getBusinessAdminUrl,
              {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!");}

      const data = await response.json();
      if (data.state === "Ok") {
        setBusinessInfo(data.business);
        setActivateStates(data.business.activateStates);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchBusiness();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  async function ActivateRegister(state) {
    setError(null);

    let url = "http://localhost:8080/deactivateBusiness/" + businessInfo.id;
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          deactivateState: state,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function ActivateHandler() {
    closePopup();
    const newState = { ...activateStates, stopped: !activateStates.stopped };
    setActivateStates(newState);
    ActivateRegister(!activateStates.stopped);
  }

  function CopyLink() {
    navigator.clipboard.writeText("https://web.vitriny.ir/business/" + params.slug);
    closeModal();
    setFlashMessage("آدرس صفحه کپی شد!");
    showMessage();
  }

  async function SelectLocationHandler(coordinates) {
    closePopup();

    setError(null);
    let url = "http://localhost:8080/business/setGoogleLocation/" + params.slug;
    let method = "POST";
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          googleLocation: coordinates,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
        setFlashMessage("آدرس روی نقشه تنظیم شد!");

        const newBusinessInfoObj = {
          ...businessInfo,
          businessInfo: {
            ...businessInfo.businessInfo,
            googleLoc: coordinates,
          },
        };
        setBusinessInfo(newBusinessInfoObj);

        showMessage();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function DeleteLocationHandler(coordinates) {
    closePopup();

    setError(null);
    let url =
      "http://localhost:8080/business/deleteGoogleLocation/" + params.slug;
    let method = "PUT";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
        setFlashMessage("آدرس روی نقشه حذف شد!");
        const newBusinessInfoObj = {
          ...businessInfo,
          businessInfo: {
            ...businessInfo.businessInfo,
            googleLoc: [],
          },
        };
        setBusinessInfo(newBusinessInfoObj);

        showMessage();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond">
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

  return (
    <>
      <Transition
        in={showOptionsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <BusinessOptionsPopup
              activateState={activateStates.stopped}
              activateHandler={ActivateHandler}
              popupClose={closePopup}
              show={state}
              addToInsta={toggleAddToInstaModal}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showGoogleLocationPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <GoogleLocationPopup
              onSelectLocation={SelectLocationHandler}
              onDeleteLocation={DeleteLocationHandler}
              popupClose={closePopup}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      {/* FLASH MESSAGE */}
      <Transition
        in={showFlashMessage}
        timeout={1000}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <FlashMessage
            message={flashMessage}
            show={state}
            hideMessage={hideFlashMessage}
          />
        )}
      </Transition>

      {/* PREMIUM MODAL */}
      <Transition
        in={showPremiumModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <GetPremiumModal show={state} modalClose={closeModal} />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      {/* ADD TO INSTA MODAL */}
      <Transition
        in={showAddToInstaModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <AddToInsta
              show={state}
              copyLink={CopyLink}
              modalClose={closeModal}
            />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      {/* PRODUCT MODAL */}
      <Transition
        in={showProductModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <GetProductModal
              nextModalProduct={nextModalProduct}
              hasNext={modalHasNext}
              product={modalProduct}
              modalClose={closeModal}
              show={state}
            />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      {!isLoading && !error && businessInfo && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>مدیریت</h2>
            <div className="ham-menu" onClick={toggleOptionsPopup}></div>
          </div>

          <div className="business-admin-page">
            {activateStates.stopped && (
              <div className="waiting-banner red">
                <div className="right">
                  <div className="waiting-icon"></div>
                  <h4>کسب و کار غیر فعال </h4>
                </div>
                <div className="left">
                  <a onClick={ActivateHandler}>
                    <span>فعال کردن</span>
                  </a>
                </div>
              </div>
            )}

            {/* <div className="waiting-banner">
 <div className="right">
 <div className="waiting-icon"></div>
 <h4>در انتظار تایید</h4>
 </div>
 <div className="left">
 <span>25:56 </span>
 </div>
 </div>

 <div className="waiting-banner message">
 <div className="right">
 <div className="waiting-icon"></div>
 <h4>شما یک پیام دارید!</h4>
 </div>
 <div className="left">
 <a onClick={() => {}}>
 <span>مشاهده پیام</span>
 <div></div>
 </a>
 </div>
 </div> */}

            <div className="business-summary" onClick={GoEditBusinessPage}>
              <div className="bu-logo">
                <div className="admin-logo-story">{/* <div></div> */}</div>
                <div className="has-story">
                  <span
                    style={{
                      backgroundImage: `url(http://localhost:8080/uploads/business/${businessInfo.businessInfo.indexImage})`,
                    }}
                  ></span>
                </div>
              </div>
              <h5 onClick={GoEditBusinessPage}>
                {businessInfo.businessInfo.title}
              </h5>
              <div className="bu-sum-flx" onClick={GoEditBusinessPage}>
                <span>
                  {businessInfo.businessInfo.cityName} /{" "}
                  {businessInfo.businessInfo.region}
                </span>
                {/* <span></span> */}
              </div>
              {/* <Link to="" className="bu-story-collection">
                <span>کالکشن استوری ها</span>
                <div></div>
              </Link> */}
            </div>

            <div style={{ padding: "2rem 2rem" }}>
              {businessInfo.businessInfo.showFeatureType === "square" ? (
                <div className="bu-squre-ftus">
                  {businessInfo.features &&
                    businessInfo.features.map(
                      (feature, index) =>
                        feature.type === "square" && (
                          <Link
                            to={`/editFeature/${feature._id}`}
                            key={index}
                            className="squre-ftu"
                          >
                            <h5>{feature.title}</h5>
                            <span>{feature.value}</span>
                          </Link>
                        )
                    )}
                </div>
              ) : (
                <div className="bu-row-ftus">
                  {businessInfo.features &&
                    businessInfo.features.map(
                      (feature, index) =>
                        feature.type === "row" && (
                          <Link
                            to={`/editFeature/${feature._id}`}
                            key={index}
                            className="row-ftu"
                          >
                            <h5>{feature.title}</h5>
                            <span>{feature.value}</span>
                          </Link>
                        )
                    )}
                </div>
              )}

              <Link
                to={{ pathname: "/addFeature", state: { id: businessInfo.id } }}
                className="button green-border"
              >
                افزودن ویژگی
              </Link>

              <h4 className="sec-title">
                معرفی {businessInfo.businessInfo.title}
              </h4>
              <p className="regular-p" onClick={GoEditBusinessPage}>
                {businessInfo.businessInfo.description}
              </p>

              <h4 className="sec-flx-title">
                <span>تلفن تماس</span>

                <Link
                  to={{
                    pathname: "/addPhone",
                    state: { id: businessInfo.id },
                  }}
                  className="add-icon-btn"
                ></Link>
              </h4>

              {businessInfo.phoneNumbers &&
                businessInfo.phoneNumbers.map((phone, index) => (
                  <Link
                    to={`/editPhone/${phone._id}`}
                    key={index}
                    className="bu-call-btn"
                  >
                    <span>
                      <div></div>
                      تلفن:
                    </span>
                    <div className="value">{phone.number}</div>
                  </Link>
                ))}

              {businessInfo.businessInfo.web &&
                businessInfo.businessInfo.web !== "undefined" && (
                  <a
                    href={`https://${businessInfo.businessInfo.web}`}
                    className="bu-web-btn"
                    target="_blank"
                  >
                    <span>
                      <div></div>
                      وب سایت:
                    </span>
                    <div className="value">{businessInfo.businessInfo.web}</div>
                  </a>
                )}

              {businessInfo.businessInfo.address &&
                businessInfo.businessInfo.address !== "undefined" && (
                  <div className="bu-address-btn" onClick={GoEditBusinessPage}>
                    <span>
                      <div></div>
                    </span>{" "}
                    <div className="value">
                      {businessInfo.businessInfo.address}
                    </div>
                  </div>
                )}

              <div className="business-google-loc">
                {businessInfo.businessInfo?.googleLoc.length !== 0 ? (
                  <div className="google-map">
                    <Mapir
                      center={businessInfo.businessInfo?.googleLoc}
                      zoom={[13]}
                      Map={Map}
                    >
                      <Mapir.Marker
                        coordinates={businessInfo.businessInfo.googleLoc}
                        anchor="bottom"
                        Image={pinImage}
                      />
                    </Mapir>
                  </div>
                ) : (
                  ""
                )}

                <div onClick={toggleGoogleLocationPopup} className="google-btn">
                  <span>
                    موقعیت روی نقشه
                    <blockquote></blockquote>
                  </span>

                  <div></div>
                </div>
                <div className="beneath-alert">
                  <span>راهنما</span>
                  <p>
                    در صورتیکه کسب و کار شما خانگی است و یا نمیخواهید آدرس آن را
                    اعلام کنید میتوانید آدرس را خالی بگذارید.
                  </p>
                </div>
              </div>

              <h4 className="sec-flx-title">
                <span>شبکه های اجتماعی</span>

                <Link
                  to={{
                    pathname: "/addSocial",
                    state: { id: businessInfo.id },
                  }}
                  className="add-icon-btn"
                ></Link>
              </h4>

              <div className="bu-socials-flx">
                {businessInfo.socials &&
                  businessInfo.socials.map((social, index) => (
                    <Link
                      key={index}
                      to={`/editSocial/${social._id}`}
                      className={`social-item ${social.type}`}
                    ></Link>
                  ))}
              </div>

              <h4 className="sec-flx-title">
                <span>محصولات و خدمات</span>

                <Link
                  to={{
                    pathname: "/addProduct",
                    state: { id: businessInfo.id },
                  }}
                  className="add-icon-btn"
                ></Link>
              </h4>
            </div>

            <div className="products-cnt">
              {businessInfo.products &&
                businessInfo.products.map((product, index) => (
                  <ProductPriceFeature
                    key={index}
                    product={product}
                    onClick={toggleProductModal.bind(this, {
                      ...product,
                      creatorId: businessInfo.creatorId,
                    })}
                  />
                ))}
              {businessInfo.productsCount > 5 ? (
                <div className="prods-pagination">
                  {/* prettier-ignore */}
                  <Link to={`/products/${businessInfo.id}`} className="more-comments"><span>مشاهده همه {businessInfo.productsCount} محصول</span><div></div> </Link>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="padding" style={{ paddingTop: "2.5rem" }}>
              {/* prettier-ignore */}
              <Link to={`/business/${params.slug}`} className="button black">نمایش صفحه کسب و کار</Link>
              {/* prettier-ignore */}
              <Link className="button black-border" to={{ pathname: "/editBusiness", state: { slug: params.slug }, }}> ویرایش اطلاعات کلی کسب و کار </Link>
            </div>
          </div>
        </>
      )}
      <FooterMenu activeItem="" />
    </>
  );
}

export default BusinessAdminPage;
