import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import SearchCityPopup from "../popups/search-city";
import Backdrop from "../components/backdrop";
import SelectCategoryPopup from "../popups/select-category";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import { editUser, setUser } from "../store/actions/userActions";

function EditUserPageForm(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pagePrivacy, setPagePrivacy] = useState("public");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState();
  const [userPic, setUserPic] = useState({
    address: "",
    pic: "",
  });
  const [userModel, setUserModel] = useState("");
  const [description, setDescription] = useState("");

  async function RegisterUser(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("destination", "user");
    formData.append("description", description);
    formData.append("pagePrivacy", pagePrivacy);
    formData.append("slug", slug);
    if (userPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", userPic.pic);
    } else if (!userPic.address) {
      formData.append("hasImage", "false");
    }

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user/editUser", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        dispatch(editUser(data.user));
        history.push("/userAdminPage");
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
    setUserPic({ address: "", pic: "" });
  }

  async function FetchUser() {
    setIsLoading(true);
    setError(null);
    const getUserAdminUrl = "http://localhost:8080/user/getUserAdmin";

    try {
      // prettier-ignore
      const response = await fetch(getUserAdminUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }
      const data = await response.json();
      if (data.state === "Ok") {
        setName(data.result.userInfo.name);
        setDescription(data.result.userInfo.aboutMe);
        setSlug(data.result.userInfo.slug);
        setPagePrivacy(data.result.pagePrivacy);
        setUserPic({
          address:
            "http://localhost:8080/uploads/user/" + data.result.userInfo.pic,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    FetchUser();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
      {!isLoading && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>ویرایش اطلاعات صفحه</h2>
          </div>
          <div className="padding register-user-page">
            <p className="description-p">
              برای معرفی بهتر خود اطلاعات زیر را تکمیل کنید.
            </p>

            <form className="regular-form" onSubmit={RegisterUser}>
              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">نام </div>
                <div className="form-input">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="نام (فارسی)"
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
              <div className="form-field">
                <div className="input-label">نام کاربری (انگلیسی)</div>
                <div className="form-input">
                  <input
                    name="slug"
                    autoComplete="off"
                    type="text"
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="مثلا ali_alavi"
                    value={slug}
                  />
                  <div className="input-check"></div>
                </div>
                {error && error.find((e) => e.param === "slug") && (
                  <div className="input-validation">
                    <span></span>
                    <p>{error.find((e) => e.param === "slug").msg}</p>
                  </div>
                )}
              </div>

              {/* FORM INPUT */}
              <div className="form-field">
                <div className="input-label">درباره من</div>
                <div className="form-input">
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="درباره من"
                    name="description"
                    id=""
                    rows="3"
                    value={description}
                  ></textarea>
                  <div className="input-check"></div>
                </div>
                {error && error.find((e) => e.param === "description") && (
                  <div className="input-validation">
                    <span></span>
                    <p>{error.find((e) => e.param === "description").msg}</p>
                  </div>
                )}
              </div>

              {/* FORM INPUT */}
              {/* <div className="form-field">
                <div className="input-label">خصوصی سازی صفحه</div>
                <div className="form-input">
                  <select
                    onChange={(e) => setPagePrivacy(e.target.value)}
                    name="pagePrivacy"
                  >
                    <option>انتخاب کنید</option>
                    <option value="private">نمایش خصوصی</option>
                    <option value="public">نمایش عمومی</option>
                  </select>
                  <div className="select-chev"></div>
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
                <span>بارگزاری عکس (اختیاری)</span>
                <div></div>
              </div>
                </div>
              </div>

              <input
                className="button form-btn"
                type="submit"
                value="ثبت اطلاعات"
              />
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default EditUserPageForm;
