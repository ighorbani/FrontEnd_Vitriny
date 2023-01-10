import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { reportChoices } from "../data/report-choices";

function BugReportPage(props) {
  const history = useHistory();
  const [choices, setChoices] = useState("");

 function ChoiceSelect(choice) {
    history.push({
      pathname: "/registerBug",
      state: {
        type: props.location.state.type,
        id: props.location.state.id,
        name: props.location.state.name,
        choice: choice,
      },
    });
  }

  function SetChoices() {
    const newArray = reportChoices.filter((item) => {
      return item.type === props.location.state.type;
    });
    setChoices(newArray);
  }

  useEffect(() => {
    SetChoices();
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>گزارش تخلف</h2>
      </div>

      <div className="padding bug-page">
        <p className="description-p">
          لطفا یکی از انواع تخلف ها را انتخاب کنید.
        </p>
      </div>

      <div className="simple-options support-chices">
        {choices &&
          choices.map((choice, index) => (
            <div
              onClick={ChoiceSelect.bind(this, choice.choices)}
              key={index}
              className="option"
            >
              <h4>{choice.choices}</h4> <div className="chev-icon"></div>
            </div>
          ))}
      </div>
    </>
  );
}

export default BugReportPage;
