import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

function FooterMenu(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchUnreadMessages() {
    if (!token) {
      return;
    }

    setError(null);
    let response = {};
    try {
      response = await fetch("http://localhost:8080/fetchUnreadMessages", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      setUnreadMessages(data.notSeenCount);
    } catch (error) {
      if (response.status === 401 && response.statusText === "Unauthorized") {
        history.push("/sessionEnded");
      }
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  return (
    <>
      <div className="footer-menu">
        <Link
          to="/"
          className={`ftr-item ${props.activeItem == "home" ? "active" : ""} `}
        >
          <div className="ftr-item-icon">
            <cite></cite>
          </div>
        </Link>

        <Link
          to="/categories"
          className={`ftr-item ${
            props.activeItem == "category" ? "active" : ""
          } `}
        >
          <div className="ftr-item-icon"></div>
        </Link>
        <Link
          to="/addPost"
          className={`ftr-item ${
            props.activeItem == "newPost" ? "active" : ""
          } `}
        >
          <div className="ftr-item-icon">
            <cite></cite>
          </div>
        </Link>

        <Link
          to="/chats"
          className={`ftr-item ${props.activeItem == "chats" ? "active" : ""} `}
        >
          <div className="ftr-item-icon">
            {unreadMessages !== 0 ? <cite className="active"></cite> : ""}
          </div>
        </Link>

        <Link
          to="/profile"
          className={`ftr-item ${
            props.activeItem == "profile" ? "active" : ""
          } `}
        >
          <div className="ftr-item-icon">
            <cite></cite>
          </div>
        </Link>
      </div>
      <div
        className="footer-padding"
        style={{
          backgroundColor: props.paddingBG ==="true" ? "var(--bg-gray)" : "white",
        }}
      ></div>
    </>
  );
}

export default FooterMenu;
