import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";

function AdminFollowersFollowing(props) {
  const token = localStorage.getItem("token");
  const [follows, setFollows] = useState([]);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const popupClasses = [
    "popup simple-option-popup follows list-with-des",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  async function fetchFollows() {
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/user/getMyFollows/" + props.followState,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }
      const data = await response.json();
      if (data.state === "Ok") {
        setFollows(data.follows);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchFollows();
  }, []);

  async function FollowerManageHandler(arg) {
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/manageFollow", {
        method: "PUT",
        body: JSON.stringify({
          action: arg.action,
          slug: arg.slug,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        if (arg.action === "remove") {
          const newFollows = follows.map((user) => {
            if (user.slug === arg.slug) {
              return {
                ...user,
                removed: true,
              };
            } else
              return {
                user,
              };
          });
          setFollows(newFollows);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function ViweFollower(slug) {
    history.push("/user/" + slug);
  }


  return (
    <>
      <div className={popupClasses.join(" ")} style={{ padding: "0" }}>
        <div className="popup-top">
          <h2>دنبال کننده ها</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="simple-options" style={{ padding: "0 2rem" }}>
          {!isLoading &&
            !error &&
            follows.length !==0 &&
            follows.map((person, index) => (
              <div key={index} className="option">
                <blockquote
                  onClick={ViweFollower.bind(this, person.slug)}
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/user/${person.image})`,
                  }}
                ></blockquote>
                <div onClick={ViweFollower.bind(this, person.slug)}>
                  <h4>{person.name}</h4>
                  <span>{person.slug}</span>
                </div>
                {person.removed ? (
                  <pre className="lit-btn gray">حذف شد</pre>
                ) : (
                  <pre
                    className="lit-btn red"
                    onClick={FollowerManageHandler.bind(this, {
                      action: "remove",
                      slug: person.slug,
                    })}
                  >
                    حذف
                  </pre>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default AdminFollowersFollowing;
