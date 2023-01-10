import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import FooterMenu from "../components/footer-menu";
import { helpQuestions } from "../data/help-questions";

function HelpQuestionsPage() {
  const history = useHistory();
  const [supportChoice, setSupportChoice] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [collapseItems, setCollapseItems] = useState([]);
  let firstItem = true;

  async function CreateSupportChat() {
    setError(null);

    let url = "http://localhost:8080/createChatSupport/";
    let method = "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.state === "ChatCreated") {
        history.push({
          pathname: "/chat",
          state: { chatId: data.chat._id },
        });
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function CollapsibleHandler(item) {
    const newState = collapseItems.map((collapseItem) => {
      if (collapseItem.data.message === item.data.message) {
        return {
          ...item,
          closed: (collapseItem.closed = !collapseItem.closed),
        };
      } else {
        return {
          ...collapseItem,
          closed: true,
        };
      }
    });

    setCollapseItems(newState);
  }

  function SetCollapseItems() {
    const collapseItemsArray = helpQuestions.map((questionItem) => {
      if (firstItem) {
        firstItem = false;
        return { data: questionItem, closed: false };
      } else {
        return { data: questionItem, closed: true };
      }
    });
    setCollapseItems(collapseItemsArray);
  }

  useEffect(() => {
    if (helpQuestions) {
      SetCollapseItems();
    }
  }, []);

  return (
    <>
      <div className="support-page-cnt">
        <div className="top-menu-name">
          <div onClick={history.goBack} className="back-menu"></div>
          <h2>پرسش های متداول</h2>
        </div>

        {collapseItems.map((collapseItem, index) => {
          const selectQuestionClasses = [
            "presentation-select-collapse ",
            collapseItem.closed === true ? " closed" : null,
          ];
          const collapseQuestionClasses = [
            "presentation-choices-cnt ",
            collapseItem.closed === true ? " closed" : null,
          ];
          return (
            <>
              <div
                key={index}
                className={selectQuestionClasses.join(" ")}
                onClick={CollapsibleHandler.bind(this, collapseItem)}
              >
                <div className="input-label">{collapseItem.data.question}</div>
                <div className="collapse-icon"></div>
              </div>
              <div className="filter-collapse-cnt">
                <div className={collapseQuestionClasses.join(" ")}>
                  <div className="message">{collapseItem.data.message}</div>
                  {collapseItem.data.hasImage === "true" && (
                    <img src={collapseItem.data.image} />
                  )}
                </div>
              </div>
              {/* <div className="hr-line"></div> */}
            </>
          );
        })}

        {/* <div className="simple-options support-chices">
          {supportMessages &&
            supportMessages.map((item, index) => (
              <div
                onClick={SupportHandler.bind(this, item)}
                key={index}
                className="option"
              >
                <h4>{item.choice}</h4> <div className="chev-icon"></div>
              </div>
            ))}
        </div> */}
      </div>
      <FooterMenu />
    </>
  );
}

export default HelpQuestionsPage;
