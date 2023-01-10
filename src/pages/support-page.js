import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { supportMessages } from "../data/support-messages";

function SupportPage() {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [supportChoice, setSupportChoice] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  async function CreateSupportChat(supportMessage) {
    
    setError(null);

    let url = "http://localhost:8080/createChatSupport";
    let method = "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({ supportMessage: supportMessage }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "GetChat") {
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

  function SupportHandler(item) {
    if (item.type !== "help-request") {
      CreateSupportChat(item.message);
    } else {
      history.push({
        pathname: "/helpQuestions",
      });
    }
  }

  return (
    <>
      <div className="support-page-cnt">
        <div className="top-menu-name">
          <div onClick={history.goBack} className="back-menu"></div>
          <h2>گزینه های پشتیبانی</h2>
        </div>
        <div className="simple-options support-chices">
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
        </div>
      </div>
    </>
  );
}

export default SupportPage;
