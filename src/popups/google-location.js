import { search } from "../components/location-api";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Mapir from "mapir-react-component";
import "mapir-react-component/dist/index.css";
import Question from "../components/question";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import pinImage from "../assets/images/pin-background.png";
import grayPin from "../assets/images/gray-pin.png";

function GoogleLocationPopup(props) {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [markerArray, setMarkerArray] = useState([]);
  const [coord, setCoord] = useState([51.42, 35.72]);

  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [marker, setMarker] = useState(null);
  const [center, setCenter] = useState([51.42047, 35.729054]);

  const popupClasses = [
    "google-location-popup popup ",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  function toggleConfirmPrompt() {
    setShowConfirmPrompt((prevState) => !prevState);
  }
  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowConfirmPrompt(false);
    setShowDeletePrompt(false);
  }

  const Map = Mapir.setToken({
    transformRequest: (url) => {
      return {
        url: url,
        headers: {
          "x-api-key": process.env.REACT_APP_MAP_API_URL,
          "Mapir-SDK": "reactjs",
        },
      };
    },
  });
  function reverseFunction(map, e) {
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_MAP_API_URL,
      },
    }).then((response) => response.json());
    // .then((data) => console.log(data));
    const array = [];
    array.push(
      <Mapir.Marker
        coordinates={[e.lngLat.lng, e.lngLat.lat]}
        anchor="bottom"
        Image={pinImage}
      />
    );
    setMarkerArray(array);
    toggleConfirmPrompt();
  }

  useEffect(() => {
    if (text.length > 1) {
      const params = {};
      const options = { text };
      for (let key in options) {
        if (options[key] !== null && options[key] !== "") {
          params[key] = options[key];
        }
      }
      search(params)
        .then((data) => data.json())
        .then((data) => {
          if (data["odata.count"] > 0) {
            setResults(data.value);
          } else {
            setResults([{ notFound: true }]);
          }
        });
    } else if (text.length === 0) {
      setResults([]);
    }
  }, [text]);

  function clearSearch() {
    setResults([]);
    setText("");
  }

  function LocationAcceptedHandler() {
    closePrompt();
    props.onSelectLocation(markerArray[0].props.coordinates);
  }

  function LocationDeleteHandler() {
    closePrompt();
    props.onDeleteLocation();
  }

  return (
    <>
      <Transition
        in={showConfirmPrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Question
            closePrompt={closePrompt}
            accept="بله"
            title="تعیین موقعیت"
            reject="خیر"
            message="آیا مطمئن هستید؟"
            promptProceed={LocationAcceptedHandler}
            show={state}
          />
        )}
      </Transition>

      <Transition
        in={showDeletePrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Question
            closePrompt={closePrompt}
            accept="حذف"
            title="حذف موقعیت"
            reject="بازگشت"
            message="آیا مطمئن هستید؟"
            promptProceed={LocationDeleteHandler}
            show={state}
          />
        )}
      </Transition>

      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>تعیین موقعیت روی نقشه</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>
        <div className="popup-scroll">
          <Mapir
            center={center}
            userLocation
            onClick={reverseFunction}
            Map={Map}
          >
            {marker !== null && (
              <Mapir.Marker
                coordinates={[marker.lng, marker.lat]}
                anchor="bottom"
              />
            )}
            {markerArray}
          </Mapir>
          <div className="container search-box">
            <div className="container search-box__item flex-row">
              <input
                autoComplete="off"
                type="text"
                id="search"
                placeholder="دنبال کجا می&zwnj;گردید..."
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              {results.length > 0 && (
                <div className="clear-seach" onClick={() => clearSearch()}>
                  <span> &#10006; </span>
                </div>
              )}
              <div className="btn-seach" onClick={toggleDeletePrompt}>
                <span>حذف</span>
              </div>
            </div>
            {results.length > 0 && (
              <div className="container search-box__item search-results">
                {results.map((item) => {
                  if (item.notFound === true) {
                    return <p>نتیجه ای یافت نشد</p>;
                  } else {
                    return (
                      <div
                        onClick={() => {
                          setResults([]);
                          setMarker({
                            lng: item.geom.coordinates[0],
                            lat: item.geom.coordinates[1],
                          });
                          setCenter(item.geom.coordinates);
                        }}
                        className="search-result-item"
                      >
                        <p className="search-result-item-title">
                          <img src={grayPin} />
                          {item.title}
                        </p>
                        <p className="search-result-item-address">
                          {item.address}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GoogleLocationPopup;
