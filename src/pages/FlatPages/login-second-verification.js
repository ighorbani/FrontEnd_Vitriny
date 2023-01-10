import { render } from "@testing-library/react";
import { setUser } from "../../store/actions/userActions";
import React, { useEffect, useState } from "react";
import { Link, BrowserRouter, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FlashMessage from "../../components/flash-message";
import Transition from "react-transition-group/Transition";

function LoginVerificationPage(props) {
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const [redirect, setRedirect] = useState();
  const [userNumber, setUserNumber] = useState();

  const [userExists, setUserExists] = useState(false);
  const [wrongCodeError, setWrongCodeError] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  var sendCodeAgainTimer = "";

  const [timer, setTimer] = useState("90");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  async function SendVerification(e) {
    setWrongCodeError(false);
    if (e.target.value.length !== 4) {
      return;
    }
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/user/loginUserVerification",
        {
          method: "POST",
          body: JSON.stringify({
            verifyCode: e.target.value,
            number: props.location.state.number,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.state === "falseCode") {
        setWrongCodeError(true);
      }
      setUserNumber(data.user.userInfo.number);
      if (data.state === "Exists") {
        dispatch(setUser(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));
        setUserExists(true);
        history.go(0);
      } else if (data.state === "Not Registered") {
        setRedirect("/loginName");
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  if (userExists) {
    setTimeout(function () {
      history.go(0);
    }, 2000);
  }

  async function TimerCounter() {
    if (timer >= 1) {
      sendCodeAgainTimer = setTimeout(() => {
        setTimer((prevState) => {
          return prevState - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setShowSendButton(true);
    }
  }

  async function SendCodeAgain() {
    fetch("http://localhost:8080/user/sendVerificationCodeAgain", {
      method: "POST",
      body: JSON.stringify({ number: props.location.state.number }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setShowSendButton(false);
    clearTimeout(sendCodeAgainTimer);
    setTimer("90");
    showMessage(true);
  }

  useEffect(() => {
    TimerCounter();
  }, [timer]);

  return (
    <>
      {/* prettier-ignore */}
      {redirect && redirect === "/loginName" && (
        <Redirect
          to={{
            pathname: "/loginName",
            state: {
              number: userNumber,
              verifyCode: document.getElementById("verificationFiled").value,
            },
          }}
        />
      )}

      {/* FLASH MESSAGE */}
      <Transition
        in={showFlashMessage}
        timeout={1000}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <FlashMessage
            show={state}
            message={`یک کد جدید به شماره ${props.location.state.number}  ارسال شد!`}
            hideMessage={hideFlashMessage}
          />
        )}
      </Transition>

      {/* <Link to="/" className="fixed-back-menu">
        <div></div>
        <span>بازگشت</span>
      </Link> */}

      <div
        className="padding-page"
        style={{
          paddingTop: "7rem",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <div className="icon-title">
          <div className="icon user">
            <div>
              <span></span>
            </div>
          </div>
          <h2>کد فعالسازی را وارد کنید</h2>
        </div>

        <p className="description-p">
          کد 4 رقمی ارسال شده به شماره {props.location.state.number} را وارد
          کنید.
        </p>

        <Link to="/loginNumber" className="green-link">
          تغییر شماره موبایل
        </Link>

        {/* FORM INPUT */}
        <div className="form-field">
          {/* <div className="input-label">شماره موبایل</div> */}
          <div className="form-input">
            <input
              onChange={(e) => SendVerification(e)}
              name="verification"
              type="number"
              id="verificationFiled"
              autoComplete="off"
              placeholder="کد را اینجا وارد نمایید..."
            />
            <div className="input-check" style={{ display: "block" }}></div>
          </div>
          {wrongCodeError && (
            <div className="input-validation">
              <span></span>
              <p>کد وارد شده اشتباه است.</p>
            </div>
          )}
        </div>

        {timer !== 0 && (
          <p className="send-code-p">{timer} ثانیه تا درخواست مجدد کد</p>
        )}

        {showSendButton && (
          <div
            onClick={SendCodeAgain}
            className="button green-outline form-btn"
          >
            درخواست مجدد کد
          </div>
        )}
      </div>
    </>
  );
}

export default LoginVerificationPage;
