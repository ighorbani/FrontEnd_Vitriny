import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/userActions";
import GoogleLocationPopup from "../popups/google-location";
import pinImage from "../assets/images/pin-background.png";
import Mapir from "mapir-react-component";
import "mapir-react-component/dist/index.css";
import { Transition } from "react-transition-group";
import Backdrop from "../components/backdrop";

function EditUserForm() {
  const dispatch = useDispatch();
  const soundStorage = JSON.parse(localStorage.getItem("soundState"));
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [userPic, setUserPic] = useState({ address: "", pic: "" });
  const [userInfo, setUserInfo] = useState({});
  const [googleLocation, setGoogleLocation] = useState();
  const [soundState, setSoundState] = useState(soundStorage?.turned);

  const [collapseItems, setCollapseItems] = useState([
    {
      name: "presentationModels",
      closed: false,
    },
  ]);

  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showGoogleLocationPopup, setShowGoogleLocationPopup] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const Map = Mapir.setToken({
    transformRequest: (url) => {
      return {
        url: url,
        headers: {
          "x-api-key": process.env.REACT_APP_MAP_API_URL,
          "Mapir-SDK": "reactjs",
        },
      };
    },
  });

  function toggleGoogleLocationPopup() {
    setShowGoogleLocationPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowGoogleLocationPopup(false);
  }

  function CollapsibleHandler(name) {
    const newState = collapseItems.map((collapseItem, index) => {
      if (collapseItem.name === name) {
        return {
          ...collapseItem,
          closed: (collapseItem.closed = !collapseItem.closed),
        };
      } else {
        return {
          ...collapseItem,
          closed: false,
        };
      }
    });

    setCollapseItems(newState);
  }

  function ChangeImageHandler(event) {
    setUserPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveImageHandler() {
    setUserPic({ address: "", pic: "" });
  }

  async function EditUser(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("destination", "user");
    if (userInfo.googleLoc) {
      formData.append("googleLoc", userInfo.googleLoc);
    }

    if (userPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", userPic.pic);
    } else if (!userPic.address) {
      formData.append("hasImage", "false");
    }

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/editUser/", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        dispatch(setUser(data.user));
        // console.log(data);
        history.goBack();
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  console.log("hi")

  function setNameHandler(e) {
    setUserInfo({ ...userInfo, name: e.target.value });
  }

  function setGoogleLocHandler(value) {
    setUserInfo({ ...userInfo, googleLoc: value });
  }

  useEffect(() => {
    if (userRedux) {
      setUserInfo(userRedux.userInfo);
    }
    if (userRedux.userInfo.pic) {
      setUserPic({
        address: "http://localhost:8080/uploads/user/" + userRedux.userInfo.pic,
        pic: "",
      });
    }
  }, [userRedux]);

  function SelectLocationHandler(value) {
    setGoogleLocation(value);
    closePopup();
  }

  function DeleteLocationHandler() {
    setGoogleLocation();
    closePopup();
  }

  function ChangeSoundState() {
    localStorage.setItem("soundState", JSON.stringify({ turned: !soundState }));
    setSoundState((prevState) => !prevState);
  }

  return (
    <>
      <Transition
        in={showGoogleLocationPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <GoogleLocationPopup
              onSelectLocation={SelectLocationHandler}
              onDeleteLocation={DeleteLocationHandler}
              popupClose={closePopup}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>ویرایش اطلاعات کاربری</h2>
      </div>

      <div className="padding edit-user-page">
        <p className="description-p">
          در این قسمت میتوانید اطلاعات کاربری و تنظیمات خود را ویرایش نمایید.
        </p>
      </div>

      <div className="padding">
        {!isLoading && !error && userInfo && (
          <form onSubmit={EditUser}>
            {/* FORM INPUT */}
            <div className="form-field">
              <div className="input-label">نام و نام خانوادگی</div>
              <div className="form-input">
                <input
                  onChange={setNameHandler}
                  name="name"
                  autoComplete="off"
                  type="text"
                  value={userInfo.name}
                />
                <div className="input-check"></div>
              </div>
              {error && error.find((e) => e.param === "number") && (
                <div className="input-validation">
                  <span></span>
                  <p>{error.find((e) => e.param === "number").msg}</p>
                </div>
              )}
            </div>

            {/* FORM INPUT */}
            {/* <div className="login-google-sec">
              <div className="google-btn" onClick={toggleGoogleLocationPopup}>
                <span>
                  ثبت موقعیت گوگل (اختیاری)
                  <blockquote></blockquote>
                </span>

                <div></div>
              </div>
              <div className="beneath-alert">
                <span>توجه</span>
                <p>
                  برای اینکه فاصله خود را تا بیزینس ها بدانید میتوانید موقعیت
                  گوگل خود را ثبت کنید.
                </p>
              </div>
            </div> */}

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
                <input onChange={(e) => ChangeImageHandler(e)} accept="image/*" className="image-input" type="file" name="image" />
                <span>بارگزاری تصویر (اختیاری)</span>
                <div></div>
              </div>
              </div>
            </div>

            {/* SOUND STATE */}
            {/* <div className="check-item">
              <div className="regular-check-flx" onClick={ChangeSoundState}>
                <div className="regular-check-item">
                  {soundState ? (
                    <>
                      <span>
                        <blockquote></blockquote>
                      </span>
                      <div>صدا فعال</div>
                    </>
                  ) : (
                    <>
                      <span></span>
                      <div>صدا غیر فعال</div>
                    </>
                  )}
                </div>
              </div>
            </div> */}

            {/* FORM INPUT */}
            {/* <div className="form-field">
              {collapseItems.map((collapseItem, index) => {
                const collapsePresentClasses = [
                  "presentation-choices-cnt ",
                  collapseItem.closed === true ? " closed" : null,
                ];

                const selectPresentClasses = [
                  "presentation-select-collapse ",
                  collapseItem.closed === true ? " closed" : null,
                ];

                if (collapseItem.name === "presentationModels") {
                  return (
                    <>
                      <div
                        className={selectPresentClasses.join(" ")}
                        onClick={CollapsibleHandler.bind(
                          this,
                          "presentationModels"
                        )}
                      >
                        <div className="input-label">سایر اطلاعات کاربری</div>
                        <div className="collapse-icon"></div>
                      </div>
                      <div key={index} className="filter-collapse-cnt">
                        <div className={collapsePresentClasses.join(" ")}>
                          <div className="form-field">
                            <div className="input-label">
                              نام و نام خانوادگی
                            </div>
                            <div className="form-input">
                              <input
                                onChange={setNameHandler}
                                name="name"
                                type="text"
                                value={userInfo.name}
                              />
                              <div className="input-check"></div>
                            </div>
                            {error && error.find((e) => e.param === "number") && (
                              <div className="input-validation">
                                <span></span>
                                <p>
                                  {error.find((e) => e.param === "number").msg}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="form-field">
                            <div className="input-label">
                              نام و نام خانوادگی
                            </div>
                            <div className="form-input">
                              <input
                                onChange={setNameHandler}
                                name="name"
                                type="text"
                                value={userInfo.name}
                              />
                              <div className="input-check"></div>
                            </div>
                            {error && error.find((e) => e.param === "number") && (
                              <div className="input-validation">
                                <span></span>
                                <p>
                                  {error.find((e) => e.param === "number").msg}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="form-field">
                            <div className="input-label">
                              نام و نام خانوادگی
                            </div>
                            <div className="form-input">
                              <input
                                onChange={setNameHandler}
                                name="name"
                                type="text"
                                value={userInfo.name}
                              />
                              <div className="input-check"></div>
                            </div>
                            {error && error.find((e) => e.param === "number") && (
                              <div className="input-validation">
                                <span></span>
                                <p>
                                  {error.find((e) => e.param === "number").msg}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }
              })}
            </div> */}

            <input
              className="button form-btn"
              type="submit"
              value="ثبت تغییرات"
            />
          </form>
        )}
      </div>
    </>
  );
}

export default EditUserForm;
