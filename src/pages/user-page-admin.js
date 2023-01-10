import UserAdminOptionsPopup from "../popups/user-admin-options";
import React, { useEffect, useState } from "react";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import AddToInsta from "../modals/add-to-insta";
import PostThumbnailView from "../components/post-thumbnail";
import GetPostModal from "../modals/get-post";
import FlashMessage from "../components/flash-message";
import { useHistory, useParams, Link } from "react-router-dom";
import FooterMenu from "../components/footer-menu";
import { useSelector, useDispatch } from "react-redux";
import AdminFollowersFollowing from "../popups/admin-follows";

function UserAdminPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const [userPageInfo, setUserPageInfo] = useState();
  const [modalPost, setModalPost] = useState();
  const [flashMessage, setFlashMessage] = useState("");
  const [modalHasNext, setModalHasNext] = useState();
  const [nextPostIndex, setNextPostIndex] = useState();
  const [activateStates, setActivateStates] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(1);

  const [showFollowsPopup, setShowFollowsPopup] = useState(false);
  const [showAddToInstaModal, setShowAddToInstaModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  function GetEditUserPage() {
    history.push("/editUserPage");
  }

  function toggleAddToInstaModal() {
    setShowAddToInstaModal((prevState) => !prevState);
    closePopup();
  }

  function toggleOptionsPopup() {
    setShowOptionsPopup((prevState) => !prevState);
  }

  function CopyLink() {
    navigator.clipboard.writeText("https://web.vitriny.ir/business/" + params.slug);
    closeModal();
    setFlashMessage("آدرس صفحه کپی شد!");
    showMessage();
  }

  function closePopup() {
    setShowOptionsPopup(false);
    setShowFollowsPopup(false);
    setSeed(Math.random());
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

  function hideFlashMessage() {
    setShowFlashMessage(false);
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

  function nextModalPost() {
    togglePostModal(userPageInfo.posts[nextPostIndex]);
  }

  function toggleFollowsPopup() {
    setShowFollowsPopup((prevState) => !prevState);
  }

  function closeModal() {
    setShowPostModal(false);
    setShowAddToInstaModal(false);
  }

  async function FetchUserAdmin() {
    setError(null);
    setIsLoading(true);
    const getUserAdminUrl = "http://localhost:8080/user/getUserAdmin";

    try {
      // prettier-ignore
      const response = await fetch( getUserAdminUrl,
              {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!");}

      const data = await response.json();
      if (data.state === "Ok") {
        setUserPageInfo(data.result);
        setActivateStates(data.result.activateStates);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchUserAdmin();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  async function ActivateRegister(state) {
    setError(null);

    let url = "http://localhost:8080/user/deactivateUserPage";
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          deactivateState: state,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function ActivateHandler() {
    closePopup();
    const newState = { ...activateStates, stopped: !activateStates.stopped };
    setActivateStates(newState);
    ActivateRegister(!activateStates.stopped);
  }

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond">
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
        in={showFollowsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <AdminFollowersFollowing
              popupClose={closePopup}
              show={state}
              followState="followers"
              // linkTo={followsLinkHandler}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      {/* ADD TO INSTA MODAL */}
      <Transition
        in={showAddToInstaModal}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <AddToInsta
              show={state}
              copyLink={CopyLink}
              modalClose={closeModal}
            />
            <Backdrop clicked={closeModal} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showOptionsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <UserAdminOptionsPopup
              activateState={activateStates.stopped}
              activateHandler={ActivateHandler}
              popupClose={closePopup}
              show={state}
              addToInsta={toggleAddToInstaModal}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      {/* FLASH MESSAGE */}
      <Transition
        in={showFlashMessage}
        timeout={1000}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <FlashMessage
            message={flashMessage}
            show={state}
            hideMessage={hideFlashMessage}
          />
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

      {!isLoading && !error && userPageInfo && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>صفحه من</h2>
            <div className="ham-menu" onClick={toggleOptionsPopup}></div>
          </div>

          <div className="user-admin-page">
            {activateStates.stopped && (
              <div className="waiting-banner red">
                <div className="right">
                  <div className="waiting-icon"></div>
                  <h4>پیج غیر فعال </h4>
                </div>
                <div className="left">
                  <a onClick={ActivateHandler}>
                    <span>فعال کردن</span>
                  </a>
                </div>
              </div>
            )}

            <div className="user-summary">
              <div className="user-pic" onClick={GetEditUserPage}>
                <div className="admin-logo-story">{/* <div></div> */}</div>
                <div className="has-story">
                  <span
                    style={{
                      backgroundImage: `url(http://localhost:8080/uploads/user/${userPageInfo.userInfo.pic})`,
                    }}
                  ></span>
                </div>
              </div>
              <h5 onClick={GetEditUserPage}>{userPageInfo.userInfo.name}</h5>
              <div className="user-sum-flx">
                {/* <Link to={`/user/${userPageInfo.userInfo.slug}`}>
                  {userPageInfo.userInfo.slug}
                </Link> */}
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
              {/* <div className="user-story-collection">
                <span>کالکشن استوری ها</span>
                <div></div>
              </div> */}
            </div>

            <div style={{ padding: "2rem 2rem" }}>
              <h4 className="sec-title">درباره من</h4>
              <p className="regular-p" onClick={GetEditUserPage}>
                {userPageInfo.userInfo.aboutMe}
              </p>

              <h4 className="sec-flx-title">
                <span>شبکه های اجتماعی </span>
                <Link
                  to={{
                    pathname: "/addUserSocial",
                    state: { id: userPageInfo.userInfo.id },
                  }}
                  className="add-icon-btn"
                ></Link>
              </h4>

              <div className="bu-socials-flx">
                {userPageInfo.socials &&
                  userPageInfo.socials.map((social, index) => (
                    <Link
                      key={index}
                      to={`/editUserSocial/${social._id}`}
                      className={`social-item ${social.type}`}
                    ></Link>
                  ))}
              </div>
            </div>

            <h4 className="sec-flx-title" style={{ padding: "2rem 2rem" }}>
              <span>پست ها</span>
              <Link
                to={{
                  pathname: "/addPost",
                  state: { id: userPageInfo.userInfo.id },
                }}
                className="add-icon-btn"
              ></Link>
            </h4>
            <div className="posts-cnt-flx">
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
          </div>
        </>
      )}
      <FooterMenu activeItem="" />
    </>
  );
}

export default UserAdminPage;
