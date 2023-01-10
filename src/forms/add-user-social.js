import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Question from "../components/question";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";

function AddUserSocialFrom(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [type, setType] = useState("");
  const [link, setLink] = useState("");

  let buttonTitle = params.socialId ? "ثبت تغییرات" : "افزودن شبکه اجتماعی";
  let pageTitle = params.socialId
    ? "ویرایش شبکه اجتماعی"
    : "افزودن شبکه اجتماعی";

  async function DeleteSocial() {
    
    setError(null);

    let url = "http://localhost:8080/user/deleteSocial/" + params.socialId;
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

  async function registerSocial(event) {
    event.preventDefault();
    
    setError(null);

    let url = "";
    let method = "";

    if (params.socialId) {
      url = "http://localhost:8080/user/editSocial/" + params.socialId;
      method = "PUT";
    } else {
      url =
        "http://localhost:8080/user/addSocial";
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({ link: link, type: type }),
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

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  async function FetchSocial() {
    
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/user/getSocial/" + params.socialId);
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();
      if (data.state === "Ok") {
        setType(data.type);
        setLink(data.link);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.socialId) {
      FetchSocial();
    }
  }, []);

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
              title="حذف شبکه اجتماعی"
              reject="رد"
              message="آیا مطمئن هستید؟"
              promptProceed={DeleteSocial}
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
      <div className="padding add-social-page">
        <p className="description-p">
          برای افزودن شبکه اجتماعی اطلاعات زیر را تکمیل نمایید. بهترین حالت
          نمایش شبکه های اجتماعی، تا 5 مورد است.
        </p>

        <form className="regular-form" onSubmit={registerSocial}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">انتخاب نوع شبکه</div>
            <div className="form-input">
              {/* prettier-ignore */}
              <select onChange={(e) => setType(e.target.value)} name="type">
                <option>انتخاب کنید</option>
                {type === "twitter" ? <option value="twitter" selected>توییتر</option> : <option value="twitter" >توییتر</option>}
                {type === "instagram" ? <option value="instagram" selected>اینستاگرام</option> : <option value="instagram" >اینستاگرام</option>}
                {type === "telegram" ? <option value="telegram" selected>تلگرام</option> : <option value="telegram" >تلگرام</option>}
                {type === "whatsapp" ? <option value="whatsapp" selected>واتساپ</option> : <option value="whatsapp" >واتساپ</option>}
                {type === "youtube" ? <option value="youtube" selected>یوتیوب</option> : <option value="youtube" >یوتیوب</option>}
                {type === "facebook" ? <option value="facebook" selected>فیس بوک</option> : <option value="facebook" >فیس بوک</option>}
              </select>

              <div className="select-chev"></div>
            </div>
            
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">لینک صفحه</div>
            <div className="form-input">
              <input
                onChange={(e) => setLink(e.target.value)}
                name="link"
                
                type="text"
                value={link}
                placeholder="لینک را بدون فاصله اینجا بنویسید"
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "link") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "link").msg}</p>
              </div>
            )}
          </div>

          {params.socialId ? (
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

export default AddUserSocialFrom;
