import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import Question from "../components/question";

function AddFactorForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");

  let buttonTitle = props.location.state.invoiceId
    ? "ثبت تغییرات"
    : "ایجاد و ارسال به کاربر";
  let pageTitle = props.location.state.invoiceId
    ? "ویرایش فاکتور"
    : "افزودن فاکتور";

  async function RegisterFactor(event) {
    event.preventDefault();
    setError(null);

    let url = "";
    let method = "";

    if (props.location.state.invoiceId) {
      url = "http://localhost:8080/editInvoice/";
      method = "PUT";
    } else {
      url = "http://localhost:8080/createInvoice/";
      method = "POST";
    }
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          name: name,
          price: price,
          unit: unit,
          description: description,
          forUserId: props.location.state.userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        history.push({
          pathname: "/userChatFactors",
          state: {
            userId: props.location.state.userId,
            userName: props.location.state.userName,
          },
        });
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchFactor() {
    setError(null);

    try {
      // prettier-ignore
      const response = await fetch("http://localhost:8080/getInvoice/" + props.location.state.invoiceId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

      const data = await response.json();

      setName(data.invoice.itemName);
      setPrice(data.invoice.itemPrice);
      setUnit(data.invoice.unit);
      setDescription(data.invoice.description);

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (props.location.state.invoiceId) {
      FetchFactor();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>

      <div className="add-product-page">
        <p
          style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          className="description-p"
        >
          لطفا در زیر اطلاعات مورد نیاز را وارد نمایید.
        </p>

        <form className="regular-form" onSubmit={RegisterFactor}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">عنوان محصول / خدمت</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                autoComplete="off"
                type="text"
                placeholder="نام محصول"
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
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">واحد</div>
            <div className="form-input">
              <input
                onChange={(e) => setUnit(e.target.value)}
                name="unit"
                type="text"
                autoComplete="off"
                placeholder="مثلا 2 عدد / 2 ساعت"
                value={unit}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "unit") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "unit").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">مبلغ (به تومان)</div>
            <div className="form-input">
              <input
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                type="number"
                placeholder="مبلغ"
                autoComplete="off"
                value={price}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "price") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "price").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">توضیحات </div>
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
            <input
              className="button form-btn"
              type="submit"
              value={buttonTitle}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AddFactorForm;
