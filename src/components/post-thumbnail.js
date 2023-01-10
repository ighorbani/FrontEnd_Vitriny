import React, { useEffect, useState } from "react";
import Transition from "react-transition-group/Transition";
import ReactionButton from "./reaction-button";
import { useSelector, useDispatch } from "react-redux";
import { setLikedPosts } from "../store/actions/userActions";
import uploadedSound from "../assets/images/white-sound.png";

function PostThumbnailView(props) {
  const [likepostTapped, setLikepostTapped] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function likeHandler() {
    setLikepostTapped(true);
    setPostLiked((prevState) => !prevState);
    const likeTappingTimer = setTimeout(() => {
      setLikepostTapped(false);
    }, 500);

    if (token) {
      dispatch(setLikedPosts({ id: props.post._id, liked: !postLiked }));
    }

    setError(null);

    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          type: "post",
          value: !postLiked,
          id: props.post._id,
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

  function SetPostLikedHandler() {
    if (userRedux.likedPosts.includes(props.post._id)) {
      setPostLiked(true);
    }
  }

  useEffect(() => {
    SetPostLikedHandler();
  }, []);

  return (
    <div
      className="post-item ftu-type"
      onClick={props.onClick}
      style={{
        backgroundImage: `url(http://localhost:8080/uploads/post/${props.post.postInfo.featureImage})`,
      }}
    >
      {props.post.postInfo.sound && <img src={uploadedSound} />}
    </div>
  );
}

export default PostThumbnailView;
