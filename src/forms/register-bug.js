import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

function RegisterBugForm(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [description, setDescription] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function RegisterBug(event) {
    event.preventDefault();

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/report/addReport", {
        method: "POST",
        body: JSON.stringify({
          id: props.location.state.id,
          type: props.location.state.type,
          choice: props.location.state.choice,
          description: description,
          name: props.location.state.name,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        history.push("/reportRegistered");
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>گزارش تخلف</h2>
      </div>

      <div className="padding bug-page">
        <p className="description-p">
          لطفا در زیر اطلاعات مربوط به تخلف را تکمیل کنید.
        </p>
      </div>

      <div className="padding">
        <form className="regular-form" onSubmit={RegisterBug}>
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">نام</div>
            <div className="form-input disabled">
              <input
                name="name"
                type="text"
                value={props.location.state.name}
              />
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">نوع تخلف</div>
            <div className="form-input disabled">
              <input
                name="choice"
                type="text"
                value={props.location.state.choice}
              />
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">توضیحات گزارش تخلف</div>
            <div className="form-input">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات"
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

          <input className="button form-btn" type="submit" value="ثبت گزارش" />
        </form>
      </div>
    </>
  );
}

export default RegisterBugForm;
