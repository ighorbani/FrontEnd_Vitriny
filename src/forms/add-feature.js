import React, { useEffect, useState } from "react";
import Question from "../components/question";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";

import { useHistory, useParams, Link } from "react-router-dom";
function AddFeatureForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("");

  let buttonTitle = params.featureId ? "ثبت تغییرات" : "افزودن ویژگی";
  let pageTitle = params.featureId ? "ویرایش ویژگی" : "افزودن ویژگی";

  async function registerFeature(event) {
    event.preventDefault();
    setError(null);

    let url = "";
    let method = "";

    if (params.featureId) {
      url = "http://localhost:8080/business/editFeature/" + params.featureId;
      method = "PUT";
    } else {
      url =
        "http://localhost:8080/business/addFeature/" + props.location.state.id;
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          title: title,
          value: value,
          type: type,
          icon: icon,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Ok") {
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

  async function DeleteFeature() {
    setError(null);

    let url =
      "http://localhost:8080/business/deleteFeature/" + params.featureId;
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
        history.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchFeature() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/business/getFeature/"+params.featureId);
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setTitle(data.title);
        setValue(data.value);
        setIcon(data.icon);
        setType(data.type);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.featureId) {
      FetchFeature();
    }
  }, []);

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
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
              accept="تایید"
              title="حذف ویژگی"
              reject="رد"
              message="آیا مطمئن هستید؟"
              promptProceed={DeleteFeature}
              show={state}
            />
            <Backdrop clicked={closePrompt} show={state} />
          </>
        )}
      </Transition>

      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>
      <div className="padding register-business-page">
        <p className="description-p">
          لطفا برای افزودن ویژگی فیلدهای زیر را تکمیل کنید. سعی کنید ویژگی ها و
          مقادیرشان تا حد امکان تک کلمه ای یا کوتاه باشد.
        </p>

        <form className="regular-form" onSubmit={registerFeature}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">عنوان ویژگی</div>
            <div className="form-input">
              <input
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                autoComplete="off"
                type="text"
                placeholder="عنوان"
                value={title}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "title") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "title").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">مقدار</div>
            <div className="form-input">
              <input
                onChange={(e) => setValue(e.target.value)}
                name="value"
                          autoComplete="off"
                type="text"
                placeholder="مقدار"
                value={value}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "value") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "value").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">نوع نمایش</div>
            <div className="form-input">
              {/* prettier-ignore */}
              <select onChange={(e) => setType(e.target.value)} name="type">
                <option>انتخاب کنید</option>
                  {type === "square" ? <option value="square" selected>مربعی</option> : <option value="square" >مربعی</option>}
                  {type === "row" ? <option value="row" selected>ردیفی</option> : <option value="row" >ردیفی</option>}
              </select>

              <div className="select-chev"></div>
            </div>
          </div>

          {params.featureId ? (
            <div className="btns-flx">
              <input
                className="button form-btn"
                type="submit"
                value={buttonTitle}
                style={{ flex: "0 0 67%" }}
              />
              <div
                onClick={toggleDeletePrompt}
                className="button red"
                style={{ flex: "0 0 30%" }}
              >
                حذف
              </div>
            </div>
          ) : (
            <input
              className="button form-btn"
              type="submit"
              value={buttonTitle}
            />
          )}
        </form>
      </div>
    </>
  );
}

export default AddFeatureForm;
