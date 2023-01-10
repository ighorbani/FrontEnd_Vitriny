import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";

function FollowersFollowing(props) {
  const token = localStorage.getItem("token");
  const [follows, setFollows] = useState([]);

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
        "http://localhost:8080/user/getUserFollows/" +
          props.followState +
          "/" +
          props.userId
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
            follows.length &&
            follows.map((person, index) => (
              <Link key={index} className="option" to={`/user/${person.slug}`}>
                <blockquote
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/user/${person.image})`,
                  }}
                ></blockquote>
                <div>
                  <h4>{person.name}</h4>
                  <span>{person.slug}</span>
                </div>
                <cite></cite>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export default FollowersFollowing;
