import React, { useEffect, useState, useMemo } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import ProductPriceFeature from "../components/product-price-feature";
import BusinessOptionsPopup from "../popups/business-options";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import GetProductModal from "../modals/get-product";

function ProductsPage() {
  const params = useParams();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [nextProductIndex, setNextProductIndex] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  function toggleProductModal(product) {
    setModalProduct(product);
    let thisProductIndex = products.findIndex((p) => {
      return p == product;
    });

    let nextProductIndex= ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex< products.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowProductModal(true);
  }

  function closeModal() {
    setShowProductModal(false);
  }

  async function FetchProducts() {
    setError(null);
    if (currentPage === 1) {
      setIsLoading(true);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/businessProducts/" +
          params.businessId +
          "/" +
          currentPage
      );

      if (!response.ok) {
        throw new Error("There is an error in catching data");
      }

      const data = await response.json();
      data.products.map((m) => {});
      setProducts(data.products);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchProducts();
  }, [currentPage]);

  function closeModal() {
    setShowProductModal(false);
  }

  function IsBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  function HandleScroll() {
    const wrappedElement = document.querySelector(".products-page");
    if (IsBottom(wrappedElement)) {
      window.removeEventListener(
        "scroll",
        setCurrentPage((prevState) => ++prevState)
      );
    }
  }

  function nextModalProduct() {
    toggleProductModal(products[nextProductIndex]);
  }

  useEffect(() => {
    window.addEventListener("scroll", HandleScroll);
    return () => {
      window.removeEventListener("scroll", HandleScroll);
    };
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

      <div className="top-menu-name comment-product-page">
        {!isLoading && !error && products.length !== 0 && (
          <>
            <div onClick={history.goBack} className="back-menu"></div>
            <Link
              to={`/business/${products[0].forBusinessId.businessInfo.slug}`}
              className="story-bu-logo"
            >
              <div
                style={{
                  backgroundImage: `url(http://localhost:8080/uploads/business/${products[0].forBusinessId.businessInfo.indexImage})`,
                }}
              ></div>
            </Link>

            <div className="comment-product-page-title">
              <h2>{products[0].forBusinessId.businessInfo.title}</h2>
              <h5>محصولات و خدمات</h5>
            </div>
          </>
        )}
      </div>

      <div className="products-cnt products-page">        
        {!isLoading &&
          !error &&
          products.length !== 0 &&
          products.map((product, index) => (
            <ProductPriceFeature
              key={index}
              product={product}
              onClick={toggleProductModal.bind(this, {
                ...product,
                creatorId: product.forBusinessId.creator,
              })}
            />
          ))}
      </div>
    </>
  );
}

export default ProductsPage;
