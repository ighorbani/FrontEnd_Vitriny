import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import UnderConstruction from "../components/under-construction";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import FilterSearch from "../popups/filter-search";
import GetProductModal from "../modals/get-product";
import { useSelector, useDispatch } from "react-redux";
import FooterMenu from "../components/footer-menu";
import GetPostModal from "../modals/get-post";

function SearchPage() {
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));

  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [nextProductIndex, setNextProductIndex] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [modalPost, setModalPost] = useState();
  const [nextPostIndex, setNextPostIndex] = useState();

  const history = useHistory();
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noFinded, setNoFinded] = useState(true);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [filterType, setFilterType] = useState();
  const [filterCity, setFilterCity] = useState("");
  const [hasFilter, setHasFilter] = useState(false);

  function toggleProductModal(product) {
    setModalProduct(product);
    let thisProductIndex = searchResult.findIndex((p) => {
      return p === product;
    });

    let nextProductIndex = ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex < searchResult.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowProductModal(true);
  }

  function togglePostModal(post) {
    setModalPost(post);
    let thisPostIndex = searchResult.findIndex((p) => {
      return p === post;
    });

    let nextPostIndex = ++thisPostIndex;
    setNextPostIndex(nextPostIndex);

    if (nextPostIndex < searchResult.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowPostModal(true);
  }

  function closeModal() {
    setShowProductModal(false);
    setShowPostModal(false);
  }

  function nextModalProduct() {
    toggleProductModal(searchResult[nextProductIndex]);
  }

  function nextModalPost() {
    togglePostModal(searchResult[nextPostIndex]);
  }

  async function SearchKey(searchValue) {
    setNoFinded(false);
    setSearchResult([]);
    if (searchValue.length < 3) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/generalSearch/" + searchValue,
        {
          method: "POST",
          body: JSON.stringify({
            // filterType: filterType,
            filterCity: filterCity,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }
      const data = await response.json();

      if (data.state === "Finded") {
        setSearchResult(data.result);
      }
      if (data.state === "NothingFinded") {
        setNoFinded(true);
        setSearchResult([]);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  function toggleFiltersPopup() {
    setShowFiltersPopup((prevState) => !prevState);
  }

  function ApplyFilters(args) {
    closePopup();
    // setFilterType(args.types);
    if (args.city) {
      setFilterCity(userLocation.id);
    } else {
      setFilterCity("");
    }
    setHasFilter(args.hasFilter);
    SearchKey(document.getElementById("searchInput").value);
  }

  function closePopup() {
    setShowFiltersPopup(false);
  }

  function resultSelectHandler(item) {
    if (item.type === "product") {
      toggleProductModal({
        ...item,
        creatorId: item.businessId,
        productInfo: {
          name: item.title,
          featureImage: item.image,
          price: item.price,
          description: item.description,
        },
        forBusinessId: {
          businessInfo: {
            slug: item.businessSlug,
            title: item.businessName,
          },
        },
      });
    }

    if (item.type === "post") {
      togglePostModal({
        ...item,
        creatorId: item.id,
        creator: {
          slug: item.creatorSlug,
          name: item.creator,
        },
        postInfo: {
          name: item.title,
          description: item.description,
          sound: item.sound,
          soundDuration: item.soundDuration,
          featureImage: item.image,
        },
      });
    }
    if (item.type === "business") {
      history.push("/business/" + item.slug);
    }
    if (item.type === "user") {
      history.push("/user/" + item.slug);
    }
  }

  return (
    <>
      {/* POST MODAL */}
      <Transition in={showPostModal} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <GetPostModal
              nextModalPost={nextModalPost}
              hasNext={modalHasNext}
              post={modalPost}
              modalClose={closeModal}
              show={state}
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
              hasNext={false}
              product={modalProduct}
              modalClose={closeModal}
              show={state}
            />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showFiltersPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <FilterSearch
              popupClose={closePopup}
              show={state}
              onApply={ApplyFilters}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <div className="top-menu-search">
        <div onClick={history.goBack} className="back-menu"></div>

        <div className="menu-search-box">
          <input
            name="search"
            onChange={(e) => SearchKey(e.target.value)}
            type="text"
            id="searchInput"
            placeholder="اینجا تایپ کنید..."
            autoComplete="off"
          />
          <div
            className={"filter " + (hasFilter ? "has-filter" : "")}
            onClick={toggleFiltersPopup}
          >
            <div></div>
            <span>فیلترها</span>
            <cite></cite>
          </div>
        </div>
      </div>

      {noFinded && (
        <div className="padding-page" style={{ paddingTop: "10rem" }}>
          <div className="icon-title">
            <div className="icon no-result">
              <div>
                <span></span>
              </div>
            </div>
            <h2>از قسمت بالا جستجو کنید!</h2>
            <p>نمایش نتایج</p>
          </div>
        </div>
      )}

      {/* <UnderConstruction /> */}

      <div className="list-with-des chev search-page">
        {searchResult?.map((item, index) => {
          return (
            <div
              key={index}
              className="option"
              onClick={resultSelectHandler.bind(this, item)}
            >
              <div className="search-image-flx">
                <div className="bu-image">
                  <div>
                    <span
                      style={{
                        backgroundImage: `url(http://localhost:8080/uploads/${item.type}/${item.image})`,
                      }}
                    ></span>
                  </div>
                </div>
                <div className="des">
                  <h4>{item.title}</h4>

                  {item.type === "business" && (
                    <>
                      {/* <span>{item.inCategory}</span> */}
                      <blockquote> در {item.city}</blockquote>
                    </>
                  )}

                  {item.type === "user" && (
                    <>
                      {/* <span>{item.inCategory}</span> */}
                      <blockquote> {item.slug}</blockquote>
                    </>
                  )}

                  {item.type === "product" && (
                    <>
                      {/* <span>{item.businessName}</span> */}
                      <blockquote> {item.creator}</blockquote>
                    </>
                  )}

                  {item.type === "post" && (
                    <>
                      {/* <span>{item.businessName}</span> */}
                      <blockquote> {item.creator}</blockquote>
                    </>
                  )}
                </div>
              </div>
              <cite></cite>
            </div>
          );
        })}
      </div>
      <FooterMenu activeItem={"category"} />
    </>
  );
}

export default SearchPage;
