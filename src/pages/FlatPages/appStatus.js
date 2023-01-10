import { useHistory, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function AppStatusPage(props) {
  const history = useHistory();

  function GoHomeHandler() {
    history.push("/");
  }

  return (
    <>
      <div className="padding-page" style={{ marginTop: "10rem" }}>
        <div className="icon-title">
          <span className="vitriny-icon"></span>
          <h2>{props.location.state.title}</h2>
          <p>{props.location.state.description}</p>
        </div>

        <Link
          style={{ marginTop: "4rem" }}
          to="/"
          className="button"
        >
          ورود مجدد
        </Link>
      </div>
    </>
  );
}

export default AppStatusPage;
