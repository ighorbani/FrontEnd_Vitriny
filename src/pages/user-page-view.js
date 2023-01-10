import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import PostThumbnailView from "../components/post-thumbnail";
import FooterMenu from "../components/footer-menu";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import GetPostModal from "../modals/get-post";
import FollowersFollowing from "../popups/follows";
import FlashMessage from "../components/flash-message";
import Question from "../components/question";
import { setFollowingUsers } from "../store/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import ImagePreview from "../components/image-preview";
import BuildBusinessVitrin from "../modals/build-business-vitrin";

function UserViewPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [userPageInfo, setUserPageInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewAddress, setImagePreviewAddress] = useState("");
  const [seed, setSeed] = useState(1);

  const [showBuildBusinessModal, setShowBuildBusinessModal] = useState(false);
  const [showFollowsPopup, setShowFollowsPopup] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalPost, setModalPost] = useState();
  const [modalHasNext, setModalHasNext] = useState();
  const [nextPostIndex, setNextPostIndex] = useState();
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [userFollowed, setUserFollowed] = useState(false);

  function ImagePreviewHandler(address) {
    setShowImagePreview((prevState) => !prevState);
    setImagePreviewAddress(address);
  }

  function CloseImagePreview() {
    setShowImagePreview(false);
  }
  async function FollowHandler() {
    setUserFollowed((prevState) => !prevState);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/user/userCTA/", {
        method: "PUT",
        body: JSON.stringify({
          type: "user",
          value: userFollowed,
          id: userPageInfo.userInfo.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
        dispatch(
          setFollowingUsers({
            id: data.result.id,
            liked: !userFollowed,
          })
        );
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function showMessage() {
    setShowFlashMessage(true);

    const showMessageTimer = setTimeout(() => {
      setShowFlashMessage(false);
    }, 3000);

    return () => {
      clearTimeout(showMessageTimer);
    };
  }

  function closePopup() {
    setShowImagePreview(false);
    setShowFollowsPopup(false);
  }

  function nextModalPost() {
    togglePostModal(userPageInfo.posts[nextPostIndex]);
  }

  function togglePostModal(post) {
    setModalPost(post);
    let thisPostIndex = userPageInfo.posts.findIndex((p) => {
      return p == post;
    });

    let nextPostIndex = ++thisPostIndex;
    setNextPostIndex(nextPostIndex);

    if (nextPostIndex < userPageInfo.posts.length) {
      setModalHasNext(true);
    } else {
      setModalHasNext(false);
    }
    setShowPostModal(true);
  }

  async function CreateChat() {
    setError(null);
    setIsLoading(true);
    let url = "http://localhost:8080/createChatUser/";
    let method = "POST";
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          yoursId: userPageInfo.userInfo.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "GetChat") {
        history.push({
          pathname: "/chat",
          state: { chatId: data.chat._id },
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchUserView() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/user/getUserView/" + params.slug
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setUserPageInfo(data.result);
      } else if (data.state === "UserHided") {
        history.push("/userStopped/" + params.slug);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  function toggleFollowsPopup() {
    setShowFollowsPopup((prevState) => !prevState);
  }

  function closeModal() {
    setShowPostModal(false);
    setSeed(Math.random());
    setShowBuildBusinessModal(false);
  }

  function hideFlashMessage() {
    setShowFlashMessage(false);
  }

  useMemo(() => {
    if (userRedux.followingUsers.includes(userPageInfo?.userInfo.id)) {
      setUserFollowed(true);
    }
  }, [userPageInfo]);

  useEffect(() => {
    closePopup();
    FetchUserView();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [params.slug]);

  // function followsLinkHandler(linkTo) {
  //   setShowFollowsPopup(false);
  //   history.push(linkTo);
  // }

  function toggleBuildBusinessModal() {
    setShowBuildBusinessModal((prevState) => !prevState);
  }

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
      <Transition
        in={showBuildBusinessModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <BuildBusinessVitrin modalClose={closeModal} show={state} />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showFollowsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <FollowersFollowing
              popupClose={closePopup}
              userId={userPageInfo?.userInfo.id}
              show={state}
              followState="followers"
              // linkTo={followsLinkHandler}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showImagePreview}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <ImagePreview
              description="بستن"
              image={imagePreviewAddress}
              hideImagePreview={CloseImagePreview}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

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

      <div className={"top-menu-name " + (token ? "" : "unregistered-top-bar")}>
        {token ? (
          <>
            <div onClick={history.goBack} className="back-menu"></div>
            <div className="menu-multiple-icons">
              {userRedux?.userInfo.id !== userPageInfo?.userInfo.id ? (
                <div id="menuDirectMsg" onClick={CreateChat}></div>
              ) : (
                ""
              )}

              {userFollowed ? (
                <div id="follow" className="followed" onClick={FollowHandler}>
                  دنبال شده
                </div>
              ) : (
                <div id="follow" onClick={FollowHandler}>
                  دنبال کردن
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="menu-logo"></Link>
            <div onClick={toggleBuildBusinessModal} className="vitriny-ad-btn">
              شبکه اجتماعی ویترینی!
            </div>
          </>
        )}
      </div>

      {!isLoading && !error && userPageInfo && (
        <div className="user-front-page">
          <div className="user-summary">
            <div
              className="user-pic"
              onClick={ImagePreviewHandler.bind(
                this,
                `http://localhost:8080/uploads/user/${userPageInfo.userInfo.pic}`
              )}
            >
              <div className="admin-logo-story">{/* <div></div> */}</div>
              <div className="has-story">
                <span
                  style={{
                    backgroundImage: `url(https://api.vitriny.ir/uploads/user/${userPageInfo.userInfo.pic})`,
                  }}
                ></span>
              </div>
            </div>

            <h5>{userPageInfo.userInfo.name}</h5>
            <div className="user-sum-flx">
              {/* <a>{userPageInfo.userInfo.slug}</a> */}
              <span
                className={userPageInfo.followersCount ? "has-follower" : ""}
                onClick={toggleFollowsPopup}
                key={seed}
              >
                {userPageInfo.followersCount
                  ? userPageInfo.followersCount + " دنبال کننده"
                  : " بدون دنبال کننده"}
              </span>
            </div>
          </div>

          <div style={{ padding: "2rem 2rem" }}>
            {userPageInfo.userInfo.aboutMe && (
              <>
                <h4 className="sec-title">درباره من</h4>
                <p className="regular-p">{userPageInfo.userInfo.aboutMe}</p>
              </>
            )}

            {userPageInfo.socials.length !== 0 ? (
              <>
                <h4 className="sec-flx-title">
                  <span>شبکه های اجتماعی</span>
                </h4>

                <div className="bu-socials-flx">
                  {userPageInfo.socials.map((social, index) => (
                    <a
                      href={social.link}
                      className="bu-web-btn"
                      target="_blank"
                      key={index}
                      className={`social-item ${social.type}`}
                    ></a>
                  ))}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          {userPageInfo.postsCount > 0 ? (
            <>
              <h4 className="sec-flx-title" style={{ padding: "2rem 2rem" }}>
                <span>پست ها</span>
                <blockquote>{userPageInfo.postsCount} مورد</blockquote>
              </h4>
              <div className="posts-cnt-flx" key={seed}>
                {userPageInfo.posts &&
                  userPageInfo.posts.map((post, index) => (
                    <PostThumbnailView
                      key={index}
                      post={post}
                      onClick={togglePostModal.bind(this, {
                        ...post,
                        creator: userPageInfo.userInfo,
                      })}
                    />
                  ))}
              </div>
            </>
          ) : (
            ""
          )}

          {/* prettier-ignore */}
          <Link
            to={{ pathname: "/bugReport", state:{type: "user", id: userPageInfo.id, name: userPageInfo.userInfo.name} }}
            className="bu-ban"><div></div><span>گزارش تخلف</span> </Link>
        </div>
      )}
      <FooterMenu activeItem="" />
    </>
  );
}

export default UserViewPage;
