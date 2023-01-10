import ReactionButton from "../components/reaction-button";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLikedProducts } from "../store/actions/userActions";
import Transition from "react-transition-group/Transition";
import OptionsMenu from "../components/options-menu";
import Backdrop from "../components/backdrop";
import { Link } from "react-router-dom";

function GetProductModal(props) {
  const [likeProductTapped, setLikeProductTapped] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [productLiked, setProductLiked] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const modalClasses = [
    "modal-container product-modal",
    props.show === "entering"
      ? "fade-in"
      : props.show === "exiting"
      ? "fade-out"
      : null,
  ];

  function closeMenu() {
    setShowOptionsMenu(false);
  }

  function toggleOptionsMenu() {
    setShowOptionsMenu((prevState) => !prevState);
  }

  let optionsOfMenu = [{}];
  if (userRedux.userInfo.id === props.product.creatorId) {
    optionsOfMenu = [
      {
        link: `/editProduct/${props.product._id}`,
        title: "ویرایش پست",
      },
    ];
  } else {
    optionsOfMenu = [
      {
        link: {
          pathname: "/bugReport",
          state: {
            name: props.product.productInfo.name,
            id: props.product._id,
            type: "product",
          },
        },
        title: "گزارش پست",
      },
      {
        link: `/business/${props.product.forBusinessId.businessInfo.slug}`,
        title: "مشاهده کسب و کار",
      },
    ];
  }

  async function likeHandler() {
    setLikeProductTapped(true);
    setProductLiked((prevState) => !prevState);
    const likeTappingTimer = setTimeout(() => {
      setLikeProductTapped(false);
    }, 500);

    if(token){
      dispatch(setLikedProducts({ id: props.product._id, liked: !productLiked }));
    }



    setError(null);

    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          type: "product",
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
    if (userRedux.likedProducts.includes(props.product._id)) {
      setProductLiked(true);
    }
  }

  useEffect(() => {
    SetProductLikedHandler();
  }, []);

  function ScrollBottomClicked() {
    closeMenu();
    props.nextModalProduct();
  }

  return (
    <>
      {/* {props.hasNext && (
        <div className="modal-scroll-bottom" onClick={ScrollBottomClicked}>
          <div></div>
        </div>
      )} */}

      <div className={modalClasses.join(" ")}>
        <div className="modal-scrollable">
          {/* <div className="modal-scroll-left">
            <div></div>
          </div>
          <div className="modal-scroll-right">
            <div></div>
          </div> */}

          {props.product && (
            <div className="modal-prod-img">
              <img
                onClick={closeMenu}
                src={`http://localhost:8080/uploads/product/${props.product.productInfo.featureImage}`}
              />
              <div className="modal-prod-ctas">
                <div className="option-business-name">
                  <div className="option" onClick={toggleOptionsMenu}>
                    <Transition
                      in={showOptionsMenu}
                      timeout={500}
                      mountOnEnter
                      unmountOnExit
                    >
                      {(state) => (
                        <>
                          <OptionsMenu options={optionsOfMenu} show={state} />
                        </>
                      )}
                    </Transition>
                  </div>
                  <Link
                    to={`/business/${props.product.forBusinessId.businessInfo.slug}`}
                    className="business-name"
                  >
                    {props.product.forBusinessId.businessInfo.title}
                  </Link>
                </div>
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
            </div>
          )}

          <div className="modal-container-cnt">
            {/* {isLoading && <h2>در حال دریافت اطلاعات!</h2>} */}
            {!props.product && (
              <>
                <h2>خطا!</h2>
                <h4>محصول در دسترس نیست!</h4>
              </>
            )}

            {props.product && (
              <>
                <h2>{props.product.productInfo.name}</h2>
                <h4>{props.product.productInfo.price}</h4>

                <p className="modal-prod-p" onClick={closeMenu}>
                  {props.product.productInfo.description}
                </p>

                {/* <div className="prod-ftus modal-prod-ftus">
                  {props.product.productTags &&
                    props.product.productTags.map((tag, index) => (
                      <div key={index}>
                        <span></span>
                        {tag}
                      </div>
                    ))}
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GetProductModal;
