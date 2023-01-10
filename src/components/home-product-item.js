import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import ReactionButton from "./reaction-button";
import { useSelector, useDispatch } from "react-redux";
import { setLikedProducts } from "../store/actions/userActions";
import { useHistory, useParams, Link } from "react-router-dom";
import OptionsMenu from "./options-menu";
function HomeProductItem(props) {
  const [likeProductTapped, setLikeProductTapped] = useState(false);
  const [productLiked, setProductLiked] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  function closeMenu() {
    setShowOptionsMenu(false);
  }

  function toggleOptionsMenu() {
    setShowOptionsMenu((prevState) => !prevState);
  }

  async function likeHandler() {
    closeMenu();
    setLikeProductTapped(true);
    setProductLiked((prevState) => !prevState);
    const likeTappingTimer = setTimeout(() => {
      setLikeProductTapped(false);
    }, 500);

    if (token) {
      dispatch(
        setLikedProducts({ id: props.product._id, liked: !productLiked })
      );
    }

    setError(null);

    let type = props.product.type;

    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          type: type,
          value: !productLiked,
          id: props.product._id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
      }
      setIsLoading(false);
      return () => {
        clearTimeout(likeTappingTimer);
      };
    } catch (error) {
      setError(error.message);
    }
  }

  function SetProductLikedHandler() {
    closeMenu();
    if (
      props.product.type === "product" &&
      userRedux.likedProducts.includes(props.product._id)
    ) {
      setProductLiked(true);
    }
    if (
      props.product.type === "post" &&
      userRedux.likedPosts.includes(props.product._id)
    ) {
      setProductLiked(true);
    }
  }

  useEffect(() => {
    SetProductLikedHandler();
  }, []);

  useEffect(() => {
    closeMenu();
  }, [props.onClick]);

  function setBusinessMenuOptions(product) {
    let optionsOfBusinessMenu = {};
    if (userRedux.userInfo.id === product.forBusinessId._id) {
      optionsOfBusinessMenu = {
        link: `/businessAdmin/${product.forBusinessId.businessInfo.slug}`,
        title: "مدیریت بیزینس",
      };
    } else {
      optionsOfBusinessMenu = {
        link: {
          pathname: "/bugReport",
          state: {
            name: product.forBusinessId.businessInfo.title,
            id: product.forBusinessId._id,
            type: "product",
          },
        },
        title: "گزارش پست",
      };
    }
    return optionsOfBusinessMenu;
  }

  function setUserMenuOptions(product) {
    let optionsOfUserMenu = {};
    if (userRedux.userInfo.id === product.creator._id) {
      optionsOfUserMenu = {
        link: "/userAdminPage",
        title: "مدیریت صفحه",
      };
    } else {
      optionsOfUserMenu = {
        link: {
          pathname: "/bugReport",
          state: {
            name: product.creator.userInfo.name,
            id: product.creator._id,
            type: "post",
          },
        },
        title: "گزارش پست",
      };
    }
    return optionsOfUserMenu;
  }

  return (
    <>
      {props.product.type === "product" ? (
        <>
          <div className="business-title-flx">
            <Link
              to={`/business/${props.product.forBusinessId.businessInfo.slug}`}
            >
              <cite
                style={{
                  backgroundImage: `url(http://localhost:8080/uploads/business/${props.product.forBusinessId.businessInfo.indexImage})`,
                }}
              ></cite>
              <span>
                {props.product.forBusinessId.businessInfo.title} /{" "}
                {props.product.forBusinessId.businessInfo.cityName}{" "}
              </span>
            </Link>
            <blockquote onClick={toggleOptionsMenu}>
              <Transition
                in={showOptionsMenu}
                timeout={500}
                mountOnEnter
                unmountOnExit
              >
                {(state) => (
                  <>
                    <OptionsMenu
                      options={[setBusinessMenuOptions(props.product)]}
                      show={state}
                    />
                  </>
                )}
              </Transition>
            </blockquote>
          </div>
          <div className="home-product-item" href={props.product._id}>
            <img
              onClick={props.onClick}
              className="img"
              src={`http://localhost:8080/uploads/product/${props.product.productInfo.featureImage}`}
            />

            <div className="product-des">
              <h5>
                <pre>
                  <cite onClick={props.onClick}>
                    {props.product.productInfo.name}
                  </cite>

                  {/* PRODUCT LIKE */}
                  <div
                    className={likeProductTapped ? "like heartbeat" : "like"}
                    onClick={likeHandler}
                  >
                    <Transition
                      in={!productLiked}
                      timeout={1000}
                      mountOnEnter
                      unmountOnExit
                    >
                      {(state) => (
                        <ReactionButton
                          show={state}
                          ownClass="outline"
                          inClass="fade-in"
                          outClass="fade-out"
                        />
                      )}
                    </Transition>

                    <Transition
                      in={productLiked}
                      timeout={1000}
                      mountOnEnter
                      unmountOnExit
                    >
                      {(state) => (
                        <ReactionButton
                          show={state}
                          ownClass="fill"
                          inClass="heartbeat"
                          outClass="fade-out"
                        />
                      )}
                    </Transition>
                  </div>
                </pre>

                <div className="summary" onClick={props.onClick}>
                  {props.product.productInfo.description.substring(0, 40)} ...
                </div>
              </h5>
            </div>
          </div>
        </>
      ) : props.product.type === "post" ? (
        <>
          <div className="business-title-flx">
            <Link to={`/user/${props.product.creator.userInfo.slug}`}>
              <cite
                style={{
                  backgroundImage: `url(http://localhost:8080/uploads/user/${props.product.creator.userInfo.pic})`,
                }}
              ></cite>
              <span>{props.product.creator.userInfo.name}</span>
            </Link>
            <blockquote onClick={toggleOptionsMenu}>
              <Transition
                in={showOptionsMenu}
                timeout={500}
                mountOnEnter
                unmountOnExit
              >
                {(state) => (
                  <>
                    <OptionsMenu
                      options={[setUserMenuOptions(props.product)]}
                      show={state}
                    />
                  </>
                )}
              </Transition>
            </blockquote>
          </div>
          <div className="home-product-item" href={props.product._id}>
            <img
              onClick={props.onClick}
              className="img"
              src={`http://localhost:8080/uploads/post/${props.product.postInfo.featureImage}`}
            />
            <div className="product-des">
              <h5>
                <pre>
                  <cite onClick={props.onClick}>
                    {props.product.postInfo.name}
                  </cite>

                  {/* PRODUCT LIKE */}
                  <div className="like-series-flx">
                    {props.product.postInfo.sound && (
                      <div className="speaker-icon"> </div>
                    )}
                    <div
                      className={likeProductTapped ? "like heartbeat" : "like"}
                      onClick={likeHandler}
                    >
                      <Transition
                        in={!productLiked}
                        timeout={1000}
                        mountOnEnter
                        unmountOnExit
                      >
                        {(state) => (
                          <ReactionButton
                            show={state}
                            ownClass="outline"
                            inClass="fade-in"
                            outClass="fade-out"
                          />
                        )}
                      </Transition>

                      <Transition
                        in={productLiked}
                        timeout={1000}
                        mountOnEnter
                        unmountOnExit
                      >
                        {(state) => (
                          <ReactionButton
                            show={state}
                            ownClass="fill"
                            inClass="heartbeat"
                            outClass="fade-out"
                          />
                        )}
                      </Transition>
                    </div>
                  </div>
                </pre>

                <div className="summary" onClick={props.onClick}>
                  {props.product.postInfo.description.substring(0, 40)} ...
                </div>
              </h5>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default HomeProductItem;
