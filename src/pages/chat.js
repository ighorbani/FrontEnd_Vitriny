import React, { useEffect, useState } from "react";
import ChatOptionsPopup from "../popups/chat-options";
import { Redirect, useHistory, useParams, Link } from "react-router-dom";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import { useSelector, useDispatch } from "react-redux";
import openSocket from "socket.io-client";
import moment from "moment";
import ImagePreview from "../components/image-preview";
import FlatOptions from "../components/flat-options";
import tapMP3 from "../assets/sounds/tap.mp3";
import Draggable, { DraggableCore } from "react-draggable";

function ChatPage(props) {
  const soundState = JSON.parse(localStorage.getItem("soundState"));
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showFlatOptions, setShowFlatOptions] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewAddress, setImagePreviewAddress] = useState("");
  const [messageToDelete, setMessageToDelete] = useState();
  const [sendMessageTapped, setSendMessageTapped] = useState(false);

  const [chatMessages, setChatMessages] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [chatInfo, setChatInfo] = useState("");
  const [sawMessageId, setSawMessageId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [redirect, setRedirect] = useState();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState({ address: "", pic: "" });

  function toggleOptionsPopup() {
    setShowOptionsPopup((prevState) => !prevState);
  }

  function toggleFlatOptions() {
    setShowFlatOptions((prevState) => !prevState);
  }

  function DragMessage(event, message) {
    let target = event.target;
    let offsetX = event.clientX;
    if (offsetX > 150) {
      setShowFlatOptions(true);
    }
    setMessageToDelete(message);
    if (message.whose === "mine") {
      target.style.transform = `translateX(${offsetX}px)`;
    } else {
      target.style.transform = `translateX(${-offsetX}px)`;
    }
  }

  function closePopup() {
    setShowOptionsPopup(false);
    setShowImagePreview(false);
    setShowFlatOptions(false);
  }

  function ChangeImageHandler(event) {
    setAttachedFile({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveImageHandler() {
    setAttachedFile({ address: "", pic: "" });
  }

  function ImagePreviewHandler(address) {
    setShowImagePreview((prevState) => !prevState);
    setImagePreviewAddress(address);
  }

  function CloseImagePreview() {
    setShowImagePreview(false);
  }

  async function FetchChat() {
    setError(null);
    const chatUrl =
      "http://localhost:8080/chat/" + props.location.state.chatId;
    setIsLoading(true);
    try {
      const response = await fetch(chatUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      setChatInfo(data.chat);
      if (data.chat.mineIsBlocking || data.chat.yoursBlocking) {
        setBlocking(true);
      }
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  async function FetchMessages() {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/getMessages/" + props.location.state.chatId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setChatMessages(data.messages);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchChat();
  }, [blocking]);

  useEffect(() => {
    FetchMessages();
  }, []);

  async function sendingMessage(event) {
    event.preventDefault();

    if (chatInfo.mineIsBlocking || chatInfo.yoursBlocking) {
      return;
    }
    setSendMessageTapped(true);

    const formData = new FormData();
    formData.append("chatId", params.chatId);
    formData.append("destination", "chat");
    if (attachedFile.pic) {
      formData.append("isImage", "true");
      formData.append("image", attachedFile.pic);
    } else {
      formData.append("message", message);
    }

    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/addChatMessge/" + props.location.state.chatId,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      if (data.state === "Ok") {
        setMessage("");
        setAttachedFile({ address: "", pic: "" });
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function blockUser() {
    setShowOptionsPopup(false);

    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/blockUser/" + props.location.state.chatId,
        {
          method: "POST",
          body: JSON.stringify({ blocking: !blocking }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function scrollToBottom() {
    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, blocking]);

  useEffect(() => {
    if (socket === null) {
      setSocket(
        openSocket("http://localhost:8080", {
          transports: ["websocket"],
        })
      );
    }
    if (socket) {
      socket.on("message", (data) => {
        if (
          data.userIds.includes(chatInfo.mineId) &&
          data.userIds.includes(chatInfo.yoursId)
        ) {
          if (data.action === "added") {
            let audioToPlay = new Audio(tapMP3);
            audioToPlay.play();
            setSawMessageId(data.newMessage.id);
            const modifiedMessage = {
              ...data.newMessage,
              whose:
                data.newMessage.whose === chatInfo.mineId
                  ? "mine"
                  : data.newMessage.whose === chatInfo.yoursId
                  ? "yours"
                  : "",
            };
            const newChatMessages = chatMessages.concat(modifiedMessage);
            setChatMessages(newChatMessages);
          }

          if (data.action === "deleted") {
            const newMessagesArray = chatMessages.filter((m) => {
              if (m.id === data.deletedMessage) {
                if (
                  data.deletingUser === chatInfo.mineId ||
                  (data.deletingUser === chatInfo.yoursId &&
                    data.owner === chatInfo.yoursId)
                ) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return true;
              }
            });
            setChatMessages(newMessagesArray);
          }
        }
        if (data.action === "hasRead") {
          let newModifiedMessages = [];
          for (var key in chatMessages) {
            if (chatMessages[key].id === data.read.messageId) {
              chatMessages[key].seen =
                data.read.userId === chatInfo.yoursId ? true : false;
            }
          }
          newModifiedMessages = chatMessages;
          setChatMessages(newModifiedMessages);
        }
      });

      socket.on("blocking", (data) => {
        if (
          data.userIds.includes(chatInfo.mineId) &&
          data.userIds.includes(chatInfo.yoursId)
        ) {
          if (data.action === "blocked") {
            setBlocking(true);
            if (data.fromUser === chatInfo.mineId) {
              setChatInfo((prevState) => {
                return { ...prevState, mineIsBlocking: true };
              });
            } else {
              setChatInfo((prevState) => {
                return { ...prevState, yoursBlocking: true };
              });
            }
          } else if (data.action === "unblocked") {
            setBlocking(false);
            setChatInfo((prevState) => {
              return {
                ...prevState,
                yoursBlocking: false,
                mineIsBlocking: false,
              };
            });
          }
        }
      });
    }
  }, [socket, chatMessages, chatInfo, setChatMessages]);

  function reportChat() {
    setRedirect("/bugReport");
  }

  function FactorsPageHandler() {
    history.push({
      pathname: "/userChatFactors",
      state: {
        userId: chatInfo.yoursId,
        userName: chatInfo.name,
      },
    });
  }

  useEffect(() => {
    if (sawMessageId) {
      // ISawMessage();
    }
  }, [sawMessageId]);

  async function ISawMessage() {
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/ISawMessage/" + props.location.state.chatId,
        {
          method: "PUT",
          body: JSON.stringify({ messageId: sawMessageId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
    } catch (error) {
      setError(error.message);
    }
  }

  async function DeleteMessageHandler(event) {
    event.preventDefault();
    closePopup();
    try {
      const response = await fetch("http://localhost:8080/deleteChatMessage", {
        method: "PUT",
        body: JSON.stringify({
          messageId: messageToDelete.id,
          chatId: props.location.state.chatId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Deleted") {
      }
    } catch (error) {
      setError(error.message);
    }
  }

  if (isLoading) {
    return (
      <div className="chats-page-cnt">
        <div className="top-menu-name">
          <Link to="/" className="back-menu"></Link>
          <h2>گفتگوها</h2>
        </div>
        <div className="loading-page">
          <div className="animated-fillbar">
            <div className="bar">
              <div className="fill"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {redirect && redirect === "/bugReport" && (
        <Redirect
          to={{
            pathname: "/bugReport",
            state: {
              name: chatInfo.name,
              id: chatInfo._id,
              type: "chat",
            },
          }}
        />
      )}

      <Transition
        in={showOptionsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <ChatOptionsPopup
              userFactors={FactorsPageHandler}
              blockUser={blockUser}
              reportChat={reportChat}
              blocking={chatInfo.mineIsBlocking}
              popupClose={closePopup}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <Transition in={showFlatOptions} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <FlatOptions
              popupClose={closePopup}
              buttons={[
                { action: DeleteMessageHandler, title: "حذف پیام" },
                { action: closePopup, title: "بستن", cssClass: "black" },
              ]}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <Transition
        in={showImagePreview}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <ImagePreview
              description="بستن"
              image={imagePreviewAddress}
              hideImagePreview={CloseImagePreview}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <div className="chat-page">
        <div className="top-menu-chat">
          <div onClick={history.goBack} className="back-menu"></div>

          {!isLoading && !error && chatInfo && (
            <div className="menu-chat-cnt">
              <div
                className="chat-ftu-img"
                // onClick={ImagePreviewHandler.bind(
                //   this,
                //   `http://localhost:8080/uploads/user/${chatInfo.pic}`
                // )}
                onClick={() => {
                  history.push(`/user/${chatInfo.userSlug}`);
                }}
              >
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/user/${chatInfo.pic})`,
                  }}
                ></div>
                {chatInfo.isOnline ? (
                  <div className="person-offline"></div>
                ) : (
                  <div className="person-offline"></div>
                )}
              </div>
              <div className="chat-person-name">
                <h4
                  onClick={() => {
                    history.push(`{/user/${chatInfo.userSlug}}`);
                  }}
                >
                  {chatInfo.name}
                </h4>
                {chatInfo.businessName ? (
                  <p>{chatInfo.businessName}</p>
                ) : (
                  <p>وضعیت</p>
                )}
              </div>
            </div>
          )}

          <div className="ham-menu" onClick={toggleOptionsPopup}></div>
        </div>

        <div id="messagesBox" className="chat-cnts">
          {!isLoading &&
            !error &&
            chatMessages &&
            chatMessages.map((m, index) => {
              // DETECT IF MESSAGE IS LINK
              let messageIsLink = false;
              if (
                m.message.startsWith("http") ||
                m.message.startsWith("https")
              ) {
                messageIsLink = true;
                if (
                  !m.message.startsWith("http") ||
                  !m.message.startsWith("https")
                ) {
                  m.message = "https://" + m.message;
                }
              }

              // ADD MESSAGE CLASSES
              let chatItemClass = "chat-brand-msg";

              if (m.whose === "yours") {
                chatItemClass = "chat-yours-msg";
              } else if (m.whose === "mine") {
                chatItemClass = "chat-mine-msg";
                if (m.seen) {
                  chatItemClass = "chat-mine-msg has-read";
                }
              }

              if (m.isImage === true) {
                chatItemClass = chatItemClass + " is-image";
              }

              return (
                <div
                  // onDrop={toggleFlatOptions}
                  draggable
                  onDrag={(event) => DragMessage(event, m)}
                  key={index}
                  className={chatItemClass}
                >
                  <div className="chat-triangle"></div>

                  {m.isImage ? (
                    <cite
                      onClick={ImagePreviewHandler.bind(
                        this,
                        `http://localhost:8080/uploads/chat/${m.message}`
                      )}
                      style={{
                        backgroundImage: `url(http://localhost:8080/uploads/chat/${m.message})`,
                      }}
                    >
                      <div className="chat-time">
                        {m.seen && <div></div>}
                        {moment(m.time).format("HH:mm")}
                      </div>
                    </cite>
                  ) : (
                    <>
                      {!messageIsLink ? (
                        <p>{m.message}</p>
                      ) : (
                        <a href={m.message} target="_blank">
                          <span>LINK:</span> {m.message}
                        </a>
                      )}

                      <div className="chat-time">
                        {m.seen && <div></div>}
                        {moment(m.time).format("HH:mm")}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

          {chatInfo.mineIsBlocking ? (
            <div className="chat-announce">
              <span>شما این کاربر را بلاک کرده اید!</span>
            </div>
          ) : chatInfo.yoursBlocking ? (
            <div className="chat-announce">
              <span>شما توسط این کاربر بلاک شده اید!</span>
            </div>
          ) : null}
        </div>

        <form onSubmit={sendingMessage} className="chat-write-box">
          {/* FORM INPUT */}
          <div className="chat-input">
            {chatInfo.mineIsBlocking ? (
              <input
                type="text"
                name="message"
                placeholder="بلاک کرده اید!"
                disabled
              />
            ) : chatInfo.yoursBlocking ? (
              <input
                type="text"
                name="message"
                placeholder="بلاک شده اید!"
                disabled
              />
            ) : (
              <input
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                name="message"
                autoComplete="off"
                placeholder={
                  attachedFile.address !== ""
                    ? "فایل الصاق شد!"
                    : "نوشتن پیام..."
                }
                value={message}
              />
            )}

            {/* FORM INPUT */}
            <div
              className={
                "chat-attach " + (attachedFile.address !== "" ? "attached" : "")
              }
            >
              <div className="upload-image-box">
                <input
                  onChange={(e) => ChangeImageHandler(e)}
                  className="image-input"
                  type="file"
                  accept="image/*"
                  name="attachment"
                />
                <div></div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            onClick={sendingMessage}
            className={sendMessageTapped ? "chat-send pulse" : "chat-send"}
          ></button>
        </form>
      </div>
    </>
  );
}

export default ChatPage;
