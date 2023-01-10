import React, { useEffect, useState } from "react";
import { suggestedCities } from "../data/suggested-cities";

function SearchCityPopup(props) {
  const token = localStorage.getItem("token");
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noFinded, setNoFinded] = useState(false);
  const [error, setError] = useState(null);

  const [showSuggestedCities, setShowSuggestedCities] = useState(true);

  const popupClasses = [
    "popup search-popup",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  // var searchInterval;

  // async function TypingHandler(value) {
  //   if (!searchInterval) {
  //     const interval = setInterval(SearchCity(value), 1000);
  //     setTimeout(function () {
  //       clearInterval(searchInterval);
  //       searchInterval = null;
  //     }, 100);
  //   }
  // }

  async function SearchCity(value) {
    setNoFinded(false);

    if (value.length < 3) {
      return;
    }

    setError(null);
    let searchCityUrl = "http://localhost:8080/searchLocation/" + value;

    try {
      // prettier-ignore
      const response = await fetch(searchCityUrl,  {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // prettier-ignore
      if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }
      const data = await response.json();
      if (data.state === "Finded") {
        setLocations(data.resultPairs);
        setShowSuggestedCities(false);
      }
      if (data.resultPairs === undefined || data.resultPairs.length == 0) {
        setNoFinded(true);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>جستجوی شهر</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="regular-form" style={{ padding: "0 2rem" }}>
          {/* FORM INPUT */}
          <div className="search-city-field">
            <div></div>
            <input
              name="name"
              type="text"
              onChange={(e) => SearchCity(e.target.value)}
              placeholder="اینجا تایپ نمایید..."
              autoComplete="off"
            />
          </div>
        </div>

        <div className="list-with-des popup-scroll">
          {locations &&
            locations.map((location, index) => (
              <div
                key={index}
                className="option"
                onClick={props.setCity.bind(this, {
                  name: location.city.title,
                  id: location.city.cityId,
                })}
              >
                <h4>{location.city.title}</h4>
                <span>{location.province}</span>
              </div>
            ))}

          {noFinded && (
            <div className="option">
              <h4>متاسفانه هیچ نتیجه ای یافت نشد!</h4>
              <span>...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchCityPopup;
