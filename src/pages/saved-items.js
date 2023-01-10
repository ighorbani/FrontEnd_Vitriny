import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import moment from "moment";
import UnderConstruction from "../components/under-construction";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import GetProductModal from "../modals/get-product";
import { useSelector, useDispatch } from "react-redux";
import GetPostModal from "../modals/get-post";
import FooterMenu from "../components/footer-menu";

function SavedItems() {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalPost, setModalPost] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [nextProductIndex, setNextProductIndex] = useState();
  const [nextPostIndex, setNextPostIndex] = useState();

  const [tabs, setTabs] = useState([
    { title: "حساب ها", address: "followedBusinesses", active: true },
    { title: "پست ها", address: "likedProducts", active: false },
  ]);

  function ActiveTabHandler(tab) {
    const newTabsArray = tabs.map((t) => {
      if (t.title === tab.title) {
        return { ...t, active: true };
      } else {
        return { ...t, active: false };
      }
    });
    FetchSaved(tab.address);
    setTabs(newTabsArray);
  }

  function toggleProductModal(product) {
    setModalProduct(product);
    let thisProductIndex = result.findIndex((p) => {
      return p === product;
    });

    let nextProductIndex = ++thisProductIndex;
    setNextProductIndex(nextProductIndex);

    if (nextProductIndex < result.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowProductModal(true);
  }

  function togglePostModal(post) {
    setModalPost(post);
    let thisPostIndex = result.findIndex((p) => {
      return p === post;
    });

    let nextPostIndex = ++thisPostIndex;
    setNextPostIndex(nextPostIndex);

    if (nextPostIndex < result.length) {
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
    toggleProductModal(result[nextProductIndex]);
  }

  function nextModalPost() {
    togglePostModal(result[nextPostIndex]);
  }

  async function FetchSaved(arg) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/" + arg, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }
      const data = await response.json();
      if (data.state === "Ok") {
        setResult(data.result);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchSaved("followedBusinesses");
  }, []);

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
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>پسند شده ها</h2>
      </div>
      <div className="tabbar">
        {tabs &&
          tabs.map((tab, index) => (
            <div
              onClick={ActiveTabHandler.bind(this, tab)}
              key={index}
              className={"tab " + (tab.active ? "active" : "")}
            >
              {tab.title}
            </div>
          ))}
      </div>

      <div
        className="list-with-des chev search-page"
        style={{ paddingTop: "13rem" }}
      >
        {isLoading && (
          <>
            <div className="icon-title" style={{ marginTop: "5rem" }}>
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
          </>
        )}

        {!isLoading &&
          result &&
          result.map((item, index) => {
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
      <FooterMenu />
    </>
  );
}

export default SavedItems;
