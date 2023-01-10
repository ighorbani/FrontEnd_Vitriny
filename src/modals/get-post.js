import ReactionButton from "../components/reaction-button";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLikedPosts } from "../store/actions/userActions";
import Transition from "react-transition-group/Transition";
import OptionsMenu from "../components/options-menu";
import Backdrop from "../components/backdrop";
import { Link } from "react-router-dom";

function GetPostModal(props) {
  const [likePostTapped, setLikePostTapped] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [soundLength, setSoundLength] = useState();
  const [soundTotalDuration, setSoundTotalDuration] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [postLiked, setPostLiked] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState();
  const [playIcon, setPlayIcon] = useState("paused");
  const [error, setError] = useState(null);

  const modalClasses = [
    "modal-container post-modal",
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
  if (userRedux.userInfo.id === props.post.creator.id) {
    optionsOfMenu = [
      {
        link: `/editPost/${props.post._id}`,
        title: "ویرایش پست",
      },
    ];
  } else {
    optionsOfMenu = [
      {
        link: {
          pathname: "/bugReport",
          state: {
            name: props.post.postInfo.name,
            id: props.post._id,
            type: "post",
          },
        },
        title: "گزارش پست",
      },
    ];
  }

  async function likeHandler() {
    setLikePostTapped(true);
    setPostLiked((prevState) => !prevState);
    const likeTappingTimer = setTimeout(() => {
      setLikePostTapped(false);
    }, 500);
if(token){
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
    if (props.post.postInfo.sound) {
      FetchSoundLength();
    }
  }, []);

  const optionsTappingTimer = setInterval(() => {
    calculatePlayingPercent();
  }, 1000);

  function ScrollBottomClicked() {
    closeMenu();
    props.nextModalPost();
  }

  function convertSToMinutesSeconds(seconds) {
    let minutes = ~~(seconds / 60);
    let extraSeconds = seconds % 60;
    return minutes + ":" + extraSeconds;
  }

  async function FetchSoundLength() {
    setError(null);
    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getSoundLength/" + props.post.postInfo.sound);
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      setSoundTotalDuration(data.result.soundTotalDuration);
      setSoundLength(data.result.soundLength);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    return () => {
      clearTimeout(optionsTappingTimer);
    };
  });

  function ConverDescription() {
    let description = props.post.postInfo.description;
    let link;
    let changedText;
    if (description.search("http")) {
      const indexOfStartLink = description.indexOf("http");      
      const indexOfEndLink = description.indexOf(' ' ,indexOfStartLink);
      link = description.substr(indexOfStartLink,indexOfEndLink)
      changedText = description.replace(link, "<a href=>" + link + "</a>");
    }
    return changedText;
  }


  var audio = document.getElementById("sound");

  const SoundPlayHandler = useCallback(() => {
    if (playIcon === "paused") {
      audio.play();
      setPlayIcon("playing");
    } else {
      audio.pause();
      setPlayIcon("paused");
    }
  }, [audio, playIcon]);

  function calculatePlayingPercent() {
    if (!audio) {
      return;
    }
    setCurrentTime(convertSToMinutesSeconds(Math.round(audio.currentTime)));
    let percentage = Math.round(audio.currentTime) / soundLength;
    percentage = Math.round(100 * percentage);
    setPercentage(percentage);
  }

  function DragTimer(event, parameter) {
    let target = event.target;
    let timeLine = document.getElementById("timeLine");
    let fillBar = document.getElementById("fillBar");
    // let offsetX = target.getBoundingClientRect().left - event.clientX;
    let offsetX = timeLine.getBoundingClientRect().right - event.clientX;
    let TimeLineWidth = timeLine.getBoundingClientRect().width;
    // target.style.right = `${offsetX - event.pageX}px`;

    let percent = Math.round((offsetX / TimeLineWidth) * 100);
    percent = Math.min(Math.max(percent, 0), 100);
    target.style.right = `${percent}%`;
    fillBar.style.width = `${percent}%`;

    let playerTimer = percent / 100;
    playerTimer = playerTimer * soundLength;
    audio.currentTime = playerTimer;
    audio.pause();
    setPlayIcon("paused");
  }

  function PlayAtCurrent() {
    audio.play();
    setPlayIcon("playing");
  }

  document.addEventListener(
    "dragover",
    function (event) {
      // prevent default to allow drop
      event.preventDefault();
    },
    false
  );

  return (
    <>
      {/* {props.hasNext && (
        <div className="modal-scroll-bottom" onClick={ScrollBottomClicked}>
          <div></div>
        </div>
      )} */}

      <div className={modalClasses.join(" ")}>
        <div className="modal-scrollable">
          {props.post && (
            <div className="modal-post-img">
              <img
                onClick={closeMenu}
                src={`http://localhost:8080/uploads/post/${props.post.postInfo.featureImage}`}
              />
              <div className="modal-post-ctas">
                <div className="option-user-name">
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
                    to={`/user/${props.post.creator.slug}`}
                    className="user-name"
                  >
                    {props.post.creator.name}
                  </Link>
                </div>
                <div
                  className={likePostTapped ? "like heartbeat" : "like"}
                  onClick={likeHandler}
                >
                  <Transition
                    in={!postLiked}
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
                    in={postLiked}
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
          {props.post.postInfo.sound.length ? (
            <audio id="sound">
              <source
                src={`http://localhost:8080/uploads/sounds/${props.post.postInfo.sound}`}
                type="audio/mp3"
              ></source>
            </audio>
          ) : (
            ""
          )}

          <div className="modal-container-cnt">
            {/* {isLoading && <h2>در حال دریافت اطلاعات!</h2>} */}
            {!props.post && (
              <>
                <h2>خطا!</h2>
                <h4>محصول در دسترس نیست!</h4>
              </>
            )}

            {props.post && (
              <>
                <h2 style={{ marginBottom: "2rem" }}>
                  {props.post.postInfo.name}
                </h2>

                {props.post.postInfo.sound.length ? (
                  <div className="post-sound-box">
                    <div
                      className={`play-pause-btn ${playIcon}`}
                      onClick={SoundPlayHandler}
                    ></div>
                    <div className="sound-timer">{currentTime}</div>
                    <div className="sound-time-line" id="timeLine">
                      <div
                        className="sound-fill"
                        id="fillBar"
                        style={{ width: percentage + "%" }}
                      ></div>
                      <div
                        className="sound-cursor"
                        onDrop={PlayAtCurrent}
                        draggable
                        style={{ right: percentage + "%" }}
                        onDrag={(event) => DragTimer(event, "parameter")}
                      ></div>
                    </div>
                    <div className="sound-length">{soundTotalDuration}</div>
                  </div>
                ) : (
                  ""
                )}
                <p className="modal-prod-p" onClick={closeMenu}>
                  {props.post.postInfo.description}
                </p>

                {/* <div className="prod-ftus modal-prod-ftus">
                  {props.post.postTags &&
                    props.post.postTags.map((tag, index) => (
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

export default GetPostModal;
