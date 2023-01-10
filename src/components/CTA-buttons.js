import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import ReactionButton from "./reaction-button";

function CTAButtons(props) {
  const token = localStorage.getItem("token");

  const params = useParams();
  const [optionsTapped, setOptionsTapped] = useState(false);
  const [likeItemTapped, setLikeItemTapped] = useState(false);
  const [itemLiked, setItemLiked] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function likeHandler() {
    setLikeItemTapped(true);
    setItemLiked((prevState) => !prevState);
    const likeTappingTimer = setTimeout(() => {
      setLikeItemTapped(false);
    }, 500);

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          likeValue: itemLiked,
          whichList: props.whichList,
          whichId: props.whichId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setIsLoading(false);
      return () => {
        clearTimeout(likeTappingTimer);
      };
    } catch (error) {
      setError(error.message);
    }
  }

  async function CTAOptions() {
    setOptionsTapped(true);
    const optionsTappingTimer = setTimeout(() => {
      setOptionsTapped(false);
    }, 500);

    return () => {
      clearTimeout(optionsTappingTimer);
    };
  }

  async function FetchUserInfo() {
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/user/");

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();

      if ((props.whichList = "story")) {
        if (data.likedStories.includes(props.whichId)) {
          setItemLiked(true);
        }
      }

      if ((props.whichList = "product")) {
        if (data.likedProducts.includes(props.whichId)) {
          setItemLiked(true);
        }
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchUserInfo();
  }, []);

  return (
    <div className="modal-prod-ctas">
      <div
        className={optionsTapped ? "option heartbeat" : "option"}
        onClick={CTAOptions}
      ></div>
      <div
        className={likeItemTapped ? "like heartbeat" : "like"}
        onClick={likeHandler}
      >
        <Transition in={!itemLiked} timeout={1000} mountOnEnter unmountOnExit>
          {(state) => (
            <ReactionButton
              show={state}
              ownClass="outline"
              inClass="fade-in"
              outClass="fade-out"
            />
          )}
        </Transition>

        <Transition in={itemLiked} timeout={1000} mountOnEnter unmountOnExit>
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
  );
}

export default CTAButtons;
