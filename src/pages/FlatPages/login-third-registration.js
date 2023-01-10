import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/actions/userActions";
import SearchCityPopup from "../../popups/search-city";

function LoginRegistrationPage(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [userPic, setUserPic] = useState({ address: "", pic: "" });
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  async function RegisterUser(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("destination", "user");
    formData.append("number", props.location.state.number);
    formData.append("verifyCode", props.location.state.verifyCode);
    if (userPic.pic !== "") {
      formData.append("hasImage", "true");
      formData.append("image", userPic.pic);
    }

    setError(null);
    
    try {
      const response = await fetch("http://localhost:8080/user/loginRegister", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.state === "Ok") {
        localStorage.setItem("token", JSON.stringify(data.token));
        dispatch(setUser(data.user));
        history.go(0);
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function ChangeImageHandler(event) {
    setUserPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveImageHandler() {
    setUserPic(null);
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
          <p>در حال ثبت اطلاعات</p>
          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="padding-page" style={{ paddingTop: "7rem" }}>
        <div className="icon-title">
          <div className="icon user">
            <div>
              <span></span>
            </div>
          </div>

          <h2>ثبت اطلاعات کاربری</h2>
        </div>

        <p className="description-p"></p>

        <form className="regular-form" onSubmit={RegisterUser}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">نام و نام خانوادگی</div>
            <div className="form-input">
              <input
                name="name"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="نام و نام خانوادگی"
                value={name}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "name") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "name").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div className="upload-images">
            <div className="edit-one-img">
              {userPic.address && (
                <div className="uploaded-image">
                  {/* prettier-ignore */}
                  <div className="uploaded-image-itself" style={{ backgroundImage: `url(${userPic.address})`}} ></div>
                  {/* prettier-ignore */}
                  <div className="remove-image" onClick={RemoveImageHandler}> حذف </div>
                </div>
              )}

              {/* prettier-ignore */}
              <div className="upload-image-box">
                <input onChange={(e) => ChangeImageHandler(e)} className="image-input" accept="image/*" type="file" name="image" />
                <span>بارگزاری تصویر (اختیاری)</span>
                <div></div>
              </div>
            </div>
          </div>

          <input className="button form-btn" type="submit" value="ثبت نام" />
        </form>
      </div>
    </>
  );
}

export default LoginRegistrationPage;
