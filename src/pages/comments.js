import React, { useEffect, useState, useMemo } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
// import moment from "moment";
import Question from "../components/question";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import moment from "jalali-moment";

function CommentsPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [comments, setComments] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState("");

  function DeleteCommentHandler(id) {
    setShowDeletePrompt((prevState) => !prevState);
    setDeleteCommentId(id);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  async function DeleteComment() {
    setError(null);

    let url = "http://localhost:8080/deleteComment/" + deleteCommentId;
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Deleted") {
        closePrompt();
        const commentIndex = comments.findIndex(
          (c) => c.id === deleteCommentId
        );
        let newComments = comments;

        if (commentIndex > -1) {
          newComments.splice(commentIndex, 1);
        }
        setComments(newComments);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchComments() {
    setError(null);
    if (currentPage === 1) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(
        "http://localhost:8080/comments/" +
          params.businessId +
          "/" +
          currentPage
      );

      if (!response.ok) {
        throw new Error("There is an error in catching data");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setComments(data.comments);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchComments();
  }, [currentPage]);

  function IsBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  function HandleScroll() {
    const wrappedElement = document.querySelector(".comment-page");
    if (IsBottom(wrappedElement)) {
      window.removeEventListener(
        "scroll",
        setCurrentPage((prevState) => ++prevState)
      );
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", HandleScroll);
    return () => {
      window.removeEventListener("scroll", HandleScroll);
    };
  }, []);

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
        in={showDeletePrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Question
              closePrompt={closePrompt}
              accept="حذف"
              title="Delete Comment"
              reject="بازگشت"
              message="آیا مطمئن هستید؟"
              promptProceed={DeleteComment}
              show={state}
            />
            <Backdrop clicked={closePrompt} show={state} />
          </>
        )}
      </Transition>
      {!isLoading && !error && comments && (
        <>
          <div className="top-menu-name comment-product-page">
            {!isLoading && !error && comments.length !== 0 && (
              <>
                <div onClick={history.goBack} className="back-menu"></div>
                <Link
                  to={`/business/${comments[0].forWhoSlug}`}
                  className="story-bu-logo"
                >
                  <div
                    style={{
                      backgroundImage: `url(http://localhost:8080/uploads/business/${comments[0].forWhoPic})`,
                    }}
                  ></div>
                </Link>
                <div className="comment-product-page-title">
                  <h2>{comments[0].forWhoName}</h2>
                  <h5>نظرات</h5>
                </div>
              </>
            )}
          </div>

          <div className="comments comment-page">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-name-flx">
                  <Link to={`/user/${comment.creatorSlug}`}>
                    <div
                      className="comment-image"
                      style={{
                        backgroundImage: `url(http://localhost:8080/uploads/user/${comment.creatorPic})`,
                      }}
                    ></div>
                    <h5>{comment.creatorName}</h5>
                  </Link>

                  <span>
                    {userRedux?.userInfo.id === comment.creatorId ? (
                      <cite
                        onClick={DeleteCommentHandler.bind(this, comment.id)}
                      ></cite>
                    ) : (
                      ""
                    )}
                    {moment(comment.date)
                      .locale("fa")
                      .format("YYYY / MM / DD")}
                  </span>
                </div>
                <p className="comment-p">{comment.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default CommentsPage;
