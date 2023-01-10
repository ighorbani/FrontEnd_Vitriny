import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import SortBusinessesPopup from "../popups/sort-businesses";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import FilterCategory from "../popups/filter-category";
import SearchCityPopup from "../popups/search-city";
import { useSelector, useDispatch } from "react-redux";
import FooterMenu from "../components/footer-menu";

function CategoryPage(props) {
  const userRedux = useSelector((state) => state.user);
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));
  const params = useParams();
  const history = useHistory();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [sortingParameter, setSortingParameter] = useState("newest");
  const [filterRegions, setFilterRegions] = useState([]);
  const [filterSaved, setFilterSaved] = useState(false);
  const [businesses, setBusinesses] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [regionsOptions, setRegionsOptions] = useState([]);
  const [city, setCity] = useState();
  const [showCityPopup, setShowCityPopup] = useState(false);

  function toggleOptionsPopup() {
    setShowOptionsPopup((prevState) => !prevState);
  }

  function toggleFiltersPopup() {
    setShowFiltersPopup((prevState) => !prevState);
  }

  function ApplyFilters(args) {
    closePopup();
    setFilterRegions(args.regions);
    setFilterSaved(args.save);
    FetchBusinesses();
  }

  function closePopup() {
    setShowOptionsPopup(false);
    setShowFiltersPopup(false);
    setShowCityPopup(false);
  }

  function SortingHandler(arg) {
    setSortingParameter(arg);
    FetchBusinesses();
  }

  async function FetchBusinesses(args) {
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/getCategoryBusinesses/" + args.id,
        {
          method: "POST",
          body: JSON.stringify({
            sort: sortingParameter,
            region: filterRegions,
            saved: filterSaved,
            allCats: args.allCats,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      const regions = data.businesses.map((business) => {
        return business.businessInfo.region;
      });
      setRegionsOptions(regions);
      setBusinesses(data.businesses);

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (props?.location?.state?.allCats) {
      FetchBusinesses({ id: params.categoryId, allCats: "true" });
    } else {
      FetchBusinesses({ id: params.categoryId, allCats: "false" });
    }

    setCity({ name: userLocation.name });
  }, []);

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function setCityState(info) {
    setCity(info);
    localStorage.setItem("userLocation", JSON.stringify(info));
    closePopup();
  }

  function SearchHandler() {
    history.push("/search");
  }

  return (
    <>
      <div className="category-businesses-page">
        <Transition in={showCityPopup} timeout={500} mountOnEnter unmountOnExit>
          {(state) => (
            <>
              <SearchCityPopup
                popupClose={closePopup}
                setCity={setCityState}
                show={state}
              />
              <Backdrop clicked={closePopup} show={state} />
            </>
          )}
        </Transition>
        <Transition
          in={showOptionsPopup}
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <>
              <SortBusinessesPopup
                sorting={SortingHandler}
                popupClose={closePopup}
                show={state}
              />
              <Backdrop clicked={closePopup} show={state} />
            </>
          )}
        </Transition>

        <Transition
          in={showFiltersPopup}
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <>
              <FilterCategory
                regionOptions={regionsOptions}
                popupClose={closePopup}
                show={state}
                onApply={ApplyFilters}
              />
              <Backdrop clicked={closePopup} show={state} />
            </>
          )}
        </Transition>
        <div className="top-menu-location">
          <div onClick={history.goBack} className="back-menu"></div>
          <div className="hdr-search-loc">
            <div onClick={SearchHandler} className="hdr-search-box">
              <div></div>
              <input type="text" placeholder="جستجوی شخص و ..." />
            </div>
            <div onClick={toggleCityPopup} className="hdr-location">
              <div className="location-icon"></div>
              <div id="location-name">{city?.name}</div>
            </div>
          </div>
        </div>

        {!isLoading && !error && businesses && (
          <>
            <div className="padding cat-page">
              <h4 className="middle-title">
                {businesses[0].inCategoryId.title}
                {" در "}
                {businesses[0].businessInfo.cityName}
              </h4>
              {/* <div className="filter-sort-flx">
              <div className="filter" onClick={toggleFiltersPopup}>
                <div></div>
                <span>فیلترها</span>
              </div>
              <div className="sort" onClick={toggleOptionsPopup}>
                <div></div>
                <span>به ترتیب</span>
              </div>
            </div> */}
            </div>

            <div className="cat-businesses cat-page">
              {businesses &&
                businesses.map((business, index) => (
                  <Link
                    to={`/business/${business.businessInfo.slug}`}
                    key={index}
                    className="business-item"
                  >
                    <div className="bu-image">
                      <div className="has-story">
                        <span
                          style={{
                            backgroundImage: `url(http://localhost:8080/uploads/business/${business.businessInfo.indexImage})`,
                          }}
                        ></span>
                      </div>
                    </div>
                    <div className="bu-info">
                      <div className="title-save">
                        <h4>{business.businessInfo.title}</h4>

                        {userRedux?.followedBusinesses.includes(
                          business._id
                        ) && <span className="prod-save"></span>}
                      </div>
                      {/* <p>{business.inCategoryId.title}</p> */}

                      <div className="loc-distance">
                        <span>
                          {business.businessInfo.cityName} /{" "}
                          {business.businessInfo.region}
                        </span>
                        {/* <span>4.8km</span> */}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </>
        )}
      </div>

      <FooterMenu activeItem={"category"} paddingBG="true" />
    </>
  );
}

export default CategoryPage;
