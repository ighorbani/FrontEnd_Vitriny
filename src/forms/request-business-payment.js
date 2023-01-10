import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import Question from "../components/question";

function RequestBusinessPaymentForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [certificatePic, setCertificatePic] = useState({
    address: "",
    pic: "",
  });
  const [identificationPic, setIdentificationPic] = useState({
    address: "",
    pic: "",
  });
  const [evidencePic, setEvidencePic] = useState({ address: "", pic: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  function RemoveCertificateImageHandler() {
    setCertificatePic({ address: "", pic: "" });
  }

  function ChangeCertificateImageHandler(event) {
    setCertificatePic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveIdentificationImageHandler() {
    setIdentificationPic({ address: "", pic: "" });
  }

  function ChangeIdentificationImageHandler(event) {
    setIdentificationPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveEvidenceImageHandler() {
    setEvidencePic({ address: "", pic: "" });
  }

  function ChangeEvidenceImageHandler(event) {
    setEvidencePic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  async function RegisterInformation(event) {
    setError(null);
    event.preventDefault();

    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("description", description);
    formData.append("birthDate", birthDate);
    // formData.append("address", address);

    // if (productPic.pic) {
    //   formData.append("hasImage", "true");
    //   formData.append("image", productPic.pic);
    // } else {
    //   formData.append("hasImage", "false");
    // }

    let url = "http://localhost:8080/business/sendFinancialInformation/";
    let method = "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
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

  async function FetchInformation() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getProduct/" + params.productId);
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();

      setCertificatePic({
        address:
          "http://localhost:8080/uploads/product/" +
          data.product.productInfo.featureImage,
      });
      setName(data.product.productInfo.name);
      setDescription(data.product.productInfo.description);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    // FetchInformation();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>فرم درخواست فروش آنلاین</h2>
      </div>

      <div className="request-business-payment-page">
        <p
          style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          className="description-p"
        >
          جهت درخواست امکان فروش آنلاین در ویترینی، لطفا فرم زیر را تکمیل
          نمایید.
          <br />
          {/* <span className="download-info">
            <div className="icon-title">
              <div className="icon cart">
                <div>
                  <span></span>
                </div>
              </div>
            </div>
            جهت پر کردن گواهی از این نمونه فایل استفاده کنید و پس از پر کردن آن،
            حتما با امضا و اثر انگشت، بصورت خوانا اسکن و بارگزاری نمایید.
            <a
              href="http://localhost:3000/vitriny.png"
              className="button"
              target="_blank"
            >
              فایل نمونه گواهی
            </a>
          </span> */}
        </p>

        <form className="regular-form" onSubmit={RegisterInformation}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">نام و نام خانوادگی (بصورت کامل)</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="fullName"
                type="text"
                placeholder="نام"
                autoComplete="off"
                value={name}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "fullName") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "fullName").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">تاریخ تولد</div>
            <div className="form-input">
              <input
                onChange={(e) => setBirthDate(e.target.value)}
                name="birthDate"
                autoComplete="off"
                type="text"
                placeholder="تاریخ تولد"
                value={birthDate}
              />
              <div className="input-check"></div>
            </div>
          </div>

          {/* FORM INPUT */}
          {/* <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">آدرس محل سکونت</div>
            <div className="form-input">
              <textarea
                onChange={(e) => setAddress(e.target.value)}
                placeholder="آدرس "
                name="address"
                rows="2"
                value={address}
              ></textarea>

              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "address") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "address").msg}</p>
              </div>
            )}
          </div> */}

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">توضیحات (اختیاری)</div>
            <div className="form-input">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات "
                name="description"
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

          <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
            {/* FORM INPUT */}

            {/* <div className="upload-images">
              <div className="edit-one-img">
                {certificatePic.address && (
                  <div className="uploaded-image">

                    <div className="uploaded-image-itself" style={{ backgroundImage: `url(${certificatePic.address})`}} ></div>

                    <div className="remove-image" onClick={RemoveCertificateImageHandler}> حذف </div>
                  </div>
                )}


                <div className="upload-image-box">
                <input onChange={(e) => ChangeCertificateImageHandler(e)} className="image-input" type="file" name="image" />
                <span>تصویر شناسنامه</span>
                <div></div>
              </div>
              </div>
            </div> */}

            {/* <div className="upload-images">
              <div className="edit-one-img">
                {identificationPic.address && (
                  <div className="uploaded-image">

                    <div className="uploaded-image-itself" style={{ backgroundImage: `url(${identificationPic.address})`}} ></div>

                    <div className="remove-image" onClick={RemoveIdentificationImageHandler}> حذف </div>
                  </div>
                )}


                <div className="upload-image-box">
                <input onChange={(e) => ChangeIdentificationImageHandler(e)} className="image-input" type="file" name="image" />
                <span>تصویر کارت ملی</span>
                <div></div>
              </div>
              </div>
            </div> */}

            {/* <div className="upload-images">
              <div className="edit-one-img">
                {evidencePic.address && (
                  <div className="uploaded-image">

                    <div className="uploaded-image-itself" style={{ backgroundImage: `url(${evidencePic.address})`}} ></div>

                    <div className="remove-image" onClick={RemoveEvidenceImageHandler}> حذف </div>
                  </div>
                )}


                <div className="upload-image-box">
                <input onChange={(e) => ChangeEvidenceImageHandler(e)} className="image-input" type="file" name="image" />
                <span>تصویر گواهی</span>
                <div></div>
              </div>
              </div>
            </div> */}

            <input
              className="button form-btn"
              type="submit"
              value="ارسال درخواست"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default RequestBusinessPaymentForm;
