import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SessionEndedPage() {
  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  }, []);

  const businessId = "";
  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon under-construction">
            <div>
              <span></span>
            </div>
          </div>
          <h2>لطفا مجددا وارد شوید!</h2>
          <p>جلسه شما به تمام رسیده است. کافیست مجددا وارد شوید!</p>
        </div>

        <Link
          to="/loginNumber"
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          ورود به ویترینی
        </Link>
      </div>
    </>
  );
}

export default SessionEndedPage;
