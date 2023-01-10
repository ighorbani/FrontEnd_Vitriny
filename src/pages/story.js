import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import CTAButtons from "../components/CTA-buttons";
import { useParams, Link } from "react-router-dom";
import StoryOptionsPopup from "../popups/story-options";
import Backdrop from "../components/backdrop";
import { Route, Switch, NavLink, Prompt, Redirect } from "react-router-dom";
import Transition from "react-transition-group/Transition";

function StoryPage() {
  const token = localStorage.getItem("token");
  const params = useParams();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const [storiesInfo, setStoriesInfo] = useState();
  const [userInfo, setUserInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  function toggleOptionsPopup() {
    setShowOptionsPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowOptionsPopup(false);
  }

  async function FetchStories() {
    
    setError(null);
    const storiesUrl = "http://localhost:8080/stories/" + params.businessId;
    
      try {
        const response = await fetch(storiesUrl, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (!response.ok) {
          throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
        }

        const data = await response.json();
        setStoriesInfo(data.stories);
        setUserInfo(data.user);
        setIsLoading(false);
        
      } catch (error) {
        setError(error.message);
      }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchStories();
  }, []);

  let numerator = 0;

  return (
    <>
      <Transition
        in={showOptionsPopup}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <StoryOptionsPopup popupClose={closePopup} show={state} />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>

      <div className="stories-holder">
        {!isLoading &&
          !error &&
          storiesInfo &&
          storiesInfo.map((story, index) => {
            numerator += 1;
            let rightCalculate = numerator * 100 - 100;

            return (
              <div
                key={index}
                className="story-page"
                style={{
                  backgroundImage: `url(${
                    "http://localhost:8080/uploads/story/" + story.storyInfo.pic
                  })`,
                  right: rightCalculate + "%",
                }}
              >
                <div className="story-scroll-left">
                  <div></div>
                </div>
                <div className="story-scroll-right">
                  <div></div>
                </div>

                {userInfo && (
                  <div className="story-numerator">
                    {storiesInfo.map((storyS, key) => {
                      let numeratorStyle = "not-seen";

                      if (userInfo.seenedStories.includes(storyS._id)) {
                        numeratorStyle = "saw";
                      }
                      if (story._id === storyS._id) {
                        numeratorStyle = "seeing";
                      }

                      let numeratorWidth = 100;
                      numeratorWidth =
                        100 / storiesInfo.length -
                        (2 * (100 / storiesInfo.length)) / 100;

                      return (
                        <div
                          key={key}
                          className={numeratorStyle}
                          style={{ flex: "0 0 " + numeratorWidth + "%" }}
                        >
                          <span></span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="story-business-name">
                  <Link to="" className="story-name-flx">
                    <div className="back-menu white"></div>
                    <div
                      className="story-bu-logo"
                      style={{
                        backgroundImage: `url(http://localhost:8080/uploads/business/${story.byBusinessId.businessInfo.indexImage})`,
                      }}
                    >
                      <div></div>
                    </div>
                    <div className="story-bu-name">
                      <h4>{story.byBusinessId.businessInfo.title}</h4>
                      <p>
                        {story.byBusinessId.businessInfo.city}/
                        {story.byBusinessId.businessInfo.region}
                      </p>
                    </div>
                  </Link>

                  <div
                    className="story-menu"
                    onClick={toggleOptionsPopup}
                  ></div>
                </div>

                <div className="story-ctas">
                  <CTAButtons whichList="story" whichId={story._id} />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default StoryPage;
