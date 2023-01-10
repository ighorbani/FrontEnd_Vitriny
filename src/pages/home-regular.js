import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import SearchCityPopup from "../popups/search-city";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import FooterMenu from "../components/footer-menu";
import { changeSettings } from "../store/actions/userActions";
import bannerImage from "../assets/images/store-banner.jpg";
import { useSelector, useDispatch } from "react-redux";
import GetProductModal from "../modals/get-product";
import HomeProductItem from "../components/home-product-item";
import AdminMessageModal from "../modals/admin-message";
import GetPostModal from "../modals/get-post";

function HomePageRegular() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user);
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));

  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [seenedProducts, setSeenedProducts] = useState([]);
  const [seed, setSeed] = useState(1);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityChanged, setCityChanged] = useState(false);

  const [showCityPopup, setShowCityPopup] = useState(false);
  const [city, setCity] = useState();
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalProduct, setModalProduct] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [nextProductIndex, setNextProductIndex] = useState();
  const [sampleImage, setSampleImage] = useState();

  async function saveFile() {
    let response = await fetch(bannerImage);
    let data = await response.blob();
    let file = new File([data], "bannerImage.jpg");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      localStorage.setItem("BannerImage", base64String);
      setSampleImage(base64String);
    };
  }
  saveFile();

  async function FetchProducts() {
    if (currentPage === 1) {
      setIsLoading(true);
    }
    setCityChanged(false);
    setError(null);
    let userId = null;
    if (userRedux?.userInfo?.id) {
      userId = userRedux.userInfo.id;
    }

    try {
      const response = await fetch("http://localhost:8080/userProducts/", {
        method: "POST",
        body: JSON.stringify({
          userLocation: userLocation,
          seenedProducts: seenedProducts,
          userId: userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("There is an error in catching data");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        let newProductsArray = [...products];
        newProductsArray = [...newProductsArray, ...data.products];
        setProducts(newProductsArray);

        let newSeenedProductsIds = data.products.map((p) => {
          return p._id;
        });
        newSeenedProductsIds = [...newSeenedProductsIds, ...seenedProducts];
        setSeenedProducts(newSeenedProductsIds);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  function toggleAdminModal() {
    setShowAdminModal((prevState) => !prevState);
  }

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowCityPopup(false);
  }

  function setCityState(info) {
    setCity(info);
    localStorage.setItem("userLocation", JSON.stringify(info));
    setProducts([]);
    setCityChanged(true);
    setCurrentPage(1);
    closePopup();
  }

  useEffect(() => {
    FetchProducts();
  }, [cityChanged]);

  function closePopup() {
    setShowCityPopup(false);
  }

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function closeModal() {
    setSeed(Math.random());
    setShowProductModal(false);
    setShowPostModal(false);
    setShowAdminModal(false);
  }

  function nextModalProduct() {
    toggleProductModal(products[nextProductIndex]);
  }

  function toggleProductModal(product) {
    let givenProduct = product;

    if (product.type === "post") {
      product = {
        ...product,
        creator: {
          id: product.creator._id,
          name: product.creator.userInfo.name,
          slug: product.creator.userInfo.slug,
        },
      };
    }

    setModalProduct(product);
    let thisProductIndex = products.findIndex((p) => {
      return p == product;
    });

    let nextProductIndex = ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex < products.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }

    if (product.type === "product") {
      setShowProductModal(true);
    } else {
      setShowPostModal(true);
    }
  }

  function SearchHandler() {
    history.push("/whatsup");
  }

  useEffect(() => {
    setCity({ name: userLocation.name });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", HandleScroll);
    return () => {
      window.removeEventListener("scroll", HandleScroll);
    };
  }, []);

  var pageInterval;

  useEffect(() => {
    FetchProducts();
  }, [currentPage]);

  function IsBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  async function HandleScroll() {
    const wrappedElement = document.querySelector(".home-content");

    if (IsBottom(wrappedElement)) {
      if (!pageInterval) {
        pageInterval = setInterval(
          setCurrentPage((prevState) => ++prevState),
          1000
        );
        setTimeout(function () {
          clearInterval(pageInterval);
          pageInterval = null;
        }, 3000);
      }
    }
  }

  let adminModalInfo = {
    title: "درباره ما",
    icon: "shield",
    iconTitle: "مستقل هستیم!",
    iconParagraph: "درباره سازندگان ویترینی",
    secondParagraph:
      "ویترینی به هیچ سازمان دولتی وابسته نیست و به صورت مستقل مدیریت می شود.",
  };

  async function HasSeenAdminMessage() {
    setShowAdminModal(false);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/user/changeSettings",
        {
          method: "PUT",
          body: JSON.stringify({ parameter: "weAreIndependent" }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();

      if (data.state === "Ok") {
        dispatch(
          changeSettings({
            seen: { weAreIndependent: true },
          })
        );
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      {/* FLASH MESSAGE */}
      <Transition in={showAdminModal} timeout={1000} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <AdminMessageModal
              info={adminModalInfo}
              show={state}
              modalClose={closeModal}
              hideMessage={HasSeenAdminMessage}
            />
            <Backdrop clicked={HasSeenAdminMessage} show={state} />
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

      <Transition in={showPostModal} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <GetPostModal
              nextModalProduct={nextModalProduct}
              hasNext={modalHasNext}
              post={modalProduct}
              modalClose={closeModal}
              show={state}
            />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>
      <Transition in={showCityPopup} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <SearchCityPopup
              popupClose={closePopup}
              setCity={setCityState}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>
      <div className="top-menu-brand">
        <Link to="/" className="menu-logo"></Link>

        <div className="hdr-loc-whatsup home">
          <div className="hdr-whatsup-box" onClick={SearchHandler}>
            <div></div>
            <blockquote></blockquote>
          </div>

          <div onClick={toggleCityPopup} className="hdr-location">
            <div className="location-icon"></div>
            <div id="location-name">{city?.name}</div>
          </div>
        </div>
      </div>

      <div className="home-page">
        {!userRedux?.settings?.seen?.weAreIndependent && (
          <div className="waiting-banner">
            <div className="right">
              <h4>وابسته به هیچ سازمانی نیستیم!</h4>
            </div>
            <div className="left">
              <a onClick={toggleAdminModal}>
                <span>مشاهده</span>
              </a>
            </div>
          </div>
        )}

        {sampleImage && (
          <Link to="/registerBusiness" className="ad-banner">
            <img
              src={`data:image/png;base64,${sampleImage}`}
              // src={bannerImage}
            />
          </Link>
        )}

        {isLoading && (
          <>
            <div className="loading-page" style={{ height: "10vh" }}>
              <div className="animated-fillbar">
                <div className="bar">
                  <div className="fill"></div>
                </div>
              </div>
              {!products.length && (
                <div>
                  <div className="icon-title">
                    {/* <div className="icon premium">
                      <div>
                        <span></span>
                      </div>
                    </div> */}
                    {/* <h2>پستی یافت نشد!</h2>
                    <p>متاسفانه هنوز در این شهر محصولی ثبت نشده است.</p> */}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="home-content" key={seed}>
          {products &&
            products.map((product, index) => (
              <HomeProductItem
                key={index}
                product={product}
                onClick={toggleProductModal.bind(this, {
                  ...product,
                  creatorId:
                    product.type === "product"
                      ? product.forBusinessId.creator
                      : product.creator._id,
                })}
              />
            ))}
        </div>
      </div>

      <FooterMenu activeItem={"home"} />
    </>
  );
}

export default HomePageRegular;
