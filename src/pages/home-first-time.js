import { useHistory, useParams, Link } from "react-router-dom";
import SearchCityPopup from "../popups/search-city";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import React, { useEffect, useState } from "react";
import bannerImage from "../assets/images/store-banner.jpg";
import { suggestedCities } from "../data/suggested-cities";

function HomePageFirst() {
  const history = useHistory();
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [city, setCity] = useState();

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function closePopup() {
    setShowCityPopup(false);
  }

  function setCityState(info) {
    setCity(info);
    localStorage.setItem("userLocation", JSON.stringify(info));
    closePopup();
    history.go(0);
  }

  return (
    <>
      <Transition in={showCityPopup} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <SearchCityPopup
              setCity={setCityState}
              popupClose={closePopup}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>
      <div className="top-menu-brand">
        <Link to="/" className="menu-logo"></Link>
        <Link to="/unregisteredProfile" className="ham-menu"></Link>
      </div>

      <div className="home-page">
        <Link to="/registerBusiness" className="ad-banner">
          <img src={bannerImage} />
        </Link>

        <div className="padding">
          <h3 className="middle-title">لطفا شهر خود را انتخاب کنید.</h3>
          <div className="search-city-field" onClick={toggleCityPopup}>
            <div></div>
            <cite>جستجوی شهر</cite>
          </div>

          <h3 className="middle-gray-title">انتخاب از بین شهرهای پر تکرار</h3>

          <div className="suggested-cities">
            {suggestedCities &&
              suggestedCities.map((suCity, index) => (
                <div
                  key={index}
                  onClick={setCityState.bind(this, {
                    name: suCity.city,
                    id: suCity.cityId,
                  })}
                >
                  {suCity.city}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePageFirst;
