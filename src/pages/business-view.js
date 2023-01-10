import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import ProductPriceFeature from "../components/product-price-feature";
import BuildBusinessVitrin from "../modals/build-business-vitrin";
import FooterMenu from "../components/footer-menu";
// import moment from "moment";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import GetProductModal from "../modals/get-product";
import FlashMessage from "../components/flash-message";
import Question from "../components/question";
import { setFollowedBusinesses } from "../store/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import Mapir from "mapir-react-component";
import "mapir-react-component/dist/index.css";
import pinImage from "../assets/images/pin-background.png";
import moment from "jalali-moment";
import ImagePreview from "../components/image-preview";

function BusinessViewPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [businessInfo, setBusinessInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewAddress, setImagePreviewAddress] = useState("");
  const [seed, setSeed] = useState(1);

  const [showBuildBusinessModal, setShowBuildBusinessModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const [nextProductIndex, setNextProductIndex] = useState();
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [businessFollowed, setBusinessFollowed] = useState(false);

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

  function ImagePreviewHandler(address) {
    setShowImagePreview((prevState) => !prevState);
    setImagePreviewAddress(address);
  }

  function CloseImagePreview() {
    setShowImagePreview(false);
  }

  async function FollowHandler() {
    setBusinessFollowed((prevState) => !prevState);

    setError(null);

    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          type: "business",
          value: businessFollowed,
          id: businessInfo.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
        dispatch(
          setFollowedBusinesses({
            id: data.result.id,
            liked: !businessFollowed,
          })
        );
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function toggleBuildBusinessModal() {
    setShowBuildBusinessModal((prevState) => !prevState);
  }

  function DeleteCommentHandler(id) {
    setShowDeletePrompt((prevState) => !prevState);
    setDeleteCommentId(id);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
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

  function closePopup() {
    setShowImagePreview(false);
  }

  function nextModalProduct() {
    toggleProductModal(businessInfo.products[nextProductIndex]);
  }

  function CopyLink() {
    navigator.clipboard.writeText("https://web.vitriny.ir/business/" + params.slug);
    closeModal();
    showMessage();
  }

  async function DeleteComment() {
    setError(null);

    let url = "http://localhost:8080/deleteComment/" + deleteCommentId;
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Deleted") {
        closePrompt();
        const commentIndex = businessInfo.comments.findIndex(
          (c) => c.id === deleteCommentId
        );
        let newBusinessInfo = businessInfo;

        if (commentIndex > -1) {
          newBusinessInfo.comments.splice(commentIndex, 1);
        }
        setBusinessInfo(newBusinessInfo);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function toggleProductModal(product) {
    setModalProduct(product);
    let thisProductIndex = businessInfo.products.findIndex((p) => {
      return p == product;
    });

    let nextProductIndex = ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex < businessInfo.products.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowProductModal(true);
  }

  async function CreateChat() {
    setError(null);
    setIsLoading(true);
    let url = "http://localhost:8080/createChatBusiness/";
    let method = "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          businessId: businessInfo.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "GetChat") {
        history.push({
          pathname: "/chat",
          state: { chatId: data.chat._id },
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchBusiness() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/getBusinessView/" + params.slug
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setBusinessInfo(data.business);
      } else if (data.state === "BusinessHided") {
        history.push("/businessStopped/" + params.slug);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  function closeModal() {
    setShowProductModal(false);
    setShowBuildBusinessModal(false);
    setSeed(Math.random());
  }

  function hideFlashMessage() {
    setShowFlashMessage(false);
  }

  useMemo(() => {
    if (userRedux.followedBusinesses.includes(businessInfo?.id)) {
      setBusinessFollowed(true);
    }
  }, [businessInfo]);

  useEffect(() => {
    FetchBusiness();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

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

  return (
    <>
      <Transition
        in={showImagePreview}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <ImagePreview
              description="بستن"
              image={imagePreviewAddress}
              hideImagePreview={CloseImagePreview}
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
            message="آدرس این صفحه کپی شد!"
            show={state}
            hideMessage={hideFlashMessage}
          />
        )}
      </Transition>
      <Transition
        in={showDeletePrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Question
              closePrompt={closePrompt}
              accept="تایید"
              title="حذف نظر"
              reject="رد"
              message="آیا مطمئن هستید؟"
              promptProceed={DeleteComment}
              show={state}
            />
            <Backdrop clicked={closePrompt} show={state} />
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

      <Transition
        in={showBuildBusinessModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <BuildBusinessVitrin modalClose={closeModal} show={state} />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      <div className={"top-menu-name " + (token ? "" : "unregistered-top-bar")}>
        {token ? (
          <>
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="menu-multiple-icons">
              <div id="menuShare" onClick={CopyLink}></div>

              {userRedux?.userInfo.id !== businessInfo?.creatorId ? (
                <div id="menuDirectMsg" onClick={CreateChat}></div>
              ) : (
                ""
              )}

              {businessFollowed ? (
                <div id="follow" className="followed" onClick={FollowHandler}>
                  دنبال شده
                </div>
              ) : (
                <div id="follow" onClick={FollowHandler}>
                  دنبال کردن
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="menu-logo"></Link>
            <div className="vitriny-ad-btn" onClick={toggleBuildBusinessModal}>
              ویترین رایگان شما!
            </div>
          </>
        )}
      </div>

      {!isLoading && !error && businessInfo && (
        <div className="business-front-page">
          <div className="business-summary">
            <div
              className="bu-logo"
              onClick={ImagePreviewHandler.bind(
                this,
                `http://localhost:8080/uploads/business/${businessInfo?.businessInfo.indexImage}`
              )}
            >
              <div className="admin-logo-story">{/* <div></div> */}</div>
              <div className="has-story">
                <span
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/business/${businessInfo?.businessInfo.indexImage})`,
                  }}
                ></span>
              </div>
            </div>
            <h5>{businessInfo.businessInfo.title}</h5>
            <div className="bu-sum-flx">
              <span>
                {businessInfo.businessInfo.cityName} /{" "}
                {businessInfo.businessInfo.region}
              </span>
            </div>
          </div>

          <div style={{ padding: "2rem 2rem" }}>
            {businessInfo.businessInfo.showFeatureType === "square" ? (
              <div className="bu-squre-ftus">
                {businessInfo.features &&
                  businessInfo.features.map(
                    (feature, index) =>
                      feature.type === "square" && (
                        <div key={index} className="squre-ftu">
                          <h5>{feature.title}</h5>
                          <span>{feature.value}</span>
                        </div>
                      )
                  )}
              </div>
            ) : (
              <div className="bu-row-ftus">
                {businessInfo.features &&
                  businessInfo.features.map(
                    (feature, index) =>
                      feature.type === "row" && (
                        <div key={index} className="row-ftu">
                          <h5>{feature.title}</h5>
                          <span>{feature.value}</span>
                        </div>
                      )
                  )}
              </div>
            )}

            <h4 className="sec-title">
              معرفی {businessInfo.businessInfo.title}
            </h4>
            <p className="regular-p">{businessInfo.businessInfo.description}</p>

            <h4 className="sec-flx-title">
              <span>راه های ارتباطی</span>
            </h4>

            {businessInfo.phoneNumbers &&
              businessInfo.phoneNumbers.map((phone, index) => (
                <a
                  href={`tel: ${phone.number}`}
                  key={index}
                  target="_blank"
                  className="bu-call-btn"
                >
                  <span>
                    <div></div>
                    تلفن
                  </span>
                  <div className="value">{phone.number}</div>
                </a>
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
                <div className="bu-address-btn">
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
            </div>

            {businessInfo.socials.length !== 0 ? (
              <>
                <h4 className="sec-flx-title">
                  <span>شبکه های اجتماعی</span>
                </h4>

                <div className="bu-socials-flx">
                  {businessInfo.socials.map((social, index) => (
                    <a
                      href={social.link}
                      className="bu-web-btn"
                      target="_blank"
                      key={index}
                      className={`social-item ${social.type}`}
                    ></a>
                  ))}
                </div>
              </>
            ) : (
              ""
            )}

            {businessInfo.products.length > 0 && (
              <h4 className="sec-flx-title">
                <span>محصولات و خدمات</span>
              </h4>
            )}
          </div>
          <div className="products-cnt" style={{padding:businessInfo.products.length > 0 ? '1rem 2rem':'0' }} key={seed}>
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

          <div className="padding">
            <h4 className="sec-flx-title">
              <span>نظرات کاربران</span>
              {token && (
                <Link
                  to={{
                    pathname: "/addComment",
                    state: { id: businessInfo.id },
                  }}
                  className="add-icon-btn"
                ></Link>
              )}
            </h4>
          </div>

          <div className="comments">
            {businessInfo?.comments?.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment-name-flx">
                  <Link to={`/user/${comment.creatorSlug}`}>
                    <div
                      className="comment-image"
                      style={{
                        backgroundImage: `url(http://localhost:8080/uploads/user/${comment.pic})`,
                      }}
                    ></div>
                    <h5>{comment.creator}</h5>
                  </Link>

                  <span>
                    {userRedux?.userInfo.id === comment.creatorId ||
                    userRedux?.userInfo.id === businessInfo?.creatorId ? (
                      <cite
                        onClick={DeleteCommentHandler.bind(this, comment.id)}
                      ></cite>
                    ) : (
                      ""
                    )}

                    {moment(comment.date).locale("fa").format("YYYY / MM / DD")}
                  </span>
                </div>
                <p className="comment-p">{comment.comment}</p>
              </div>
            ))}
          </div>
          {businessInfo?.commentsCount > 5 ? (
            <Link to={`/comments/${businessInfo.id}`} className="more-comments">
              <span>مشاهده همه {businessInfo.commentsCount} نظر</span>
              <div></div>{" "}
            </Link>
          ) : (
            ""
          )}

          {/* prettier-ignore */}
          <Link
            to={{ pathname: "/bugReport", state:{type: "business", id: businessInfo.id, name: businessInfo.businessInfo.title} }}
            className="bu-ban"><div></div><span>گزارش تخلف بیزینس</span> </Link>
        </div>
      )}
      <FooterMenu activeItem="" />
    </>
  );
}

export default BusinessViewPage;
