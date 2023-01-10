import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SignOut() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  }, []);

  function GoHomeHandler() {
    history.go(0);
  }

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon business">
            <div>
              <span></span>
            </div>
          </div>
          <h2>از حساب کاربری خارج شدید!</h2>
          <p>برای ادامه دکمه زیر را لمس کنید.</p>
        </div>

        <div
          onClick={GoHomeHandler}
          className="button green-outline"
          style={{ marginTop: "10rem" }}
        >
          بازگشت به صفحه اصلی
        </div>
      </div>
    </>
  );
}

export default SignOut;
