import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import ReactionButton from "../components/reaction-button";
import { useSelector, useDispatch } from "react-redux";
import { setLikedProducts } from "../store/actions/userActions";

function ProductPriceFeature(props) {
  const [likeProductTapped, setLikeProductTapped] = useState(false);
  const [productLiked, setProductLiked] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function likeHandler() {
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

  return (
    <div className="product-item ftu-type" href={props.product._id}>
      <div
        className="product-image"
        onClick={props.onClick}
        style={{
          backgroundImage: `url(http://localhost:8080/uploads/product/${props.product.productInfo.featureImage})`,
        }}
      ></div>
      <div className="prod-cnt">
        <h5>
          <blockquote onClick={props.onClick}>
            {props.product.productInfo.name}
          </blockquote>
          <div className="prod-ftus" onClick={props.onClick}>
            <div>
              {props.product.productInfo.description.substring(0, 30)} ...
            </div>
          </div>
        </h5>

        <div className="prod-price-flx">
          <span onClick={props.onClick}>{props.product.productInfo.price}</span>
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
        </div>
      </div>
    </div>
  );
}

export default ProductPriceFeature;
