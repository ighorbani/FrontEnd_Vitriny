import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import FooterMenu from "../components/footer-menu";
import SearchCityPopup from "../popups/search-city";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/userActions";

function CategoriesPage(props) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const userLocation = JSON.parse(localStorage.getItem("userLocation"));

  // dispatch(setUser(storageUser));
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [cityChanged, setCityChanged] = useState(false);
  const history = useHistory();
  const [city, setCity] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryStep, setSubCategoryStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState(null);

  function setCityState(info) {
    setCity(info);
    localStorage.setItem("userLocation", JSON.stringify(info));
    setSubCategories([]);
    setCategories([]);
    setCityChanged(true);
    closePopup();
  }

  function SearchHandler() {
    history.push("/search");
  }

  function closePopup() {
    setShowCityPopup(false);
  }

  function toggleCityPopup() {
    setShowCityPopup((prevState) => !prevState);
  }

  function showSubCategories(doc) {
    setSelectedCategory({ title: doc.title, slug: doc.slug });
    setSubCategories([]);
    setSubCategoryStep(true);
    const givenIndexOfCategory = categories.findIndex(
      (category) => category._doc.slug === doc.slug
    );
    const subCategoriesList = categories[givenIndexOfCategory].childCats;
    setSubCategories(subCategoriesList);
  }

  async function FetchCategories() {
    setCityChanged(false);
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/getUserCategories", {
        method: "POST",
        body: JSON.stringify({
          userLocation: userLocation,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      setCategories(data.result);
      const withFillSubcategories = data.result.filter((c) => {
        if (c.childCats.length !== 0) {
          return true;
        }
      });

      if (withFillSubcategories.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchCategories();
    setCity({ name: userLocation.name });
  }, []);

  function BackMenuButton() {
    if (subCategoryStep) {
      setSubCategoryStep(false);
    } else {
      history.push("/");
    }
  }

  useEffect(() => {
    FetchCategories();
  }, [cityChanged]);

  return (
    <>
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
      <div className="categories-page">
        <div className="top-menu-name">
          <div onClick={BackMenuButton} className="back-menu"></div>
          <h2>جستجو</h2>
        </div>
        <div className="top-menu-location">
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

        {isLoading && (
          <>
            <div className="loading-page" style={{ height: "10vh" }}>
              <div className="animated-fillbar">
                <div className="bar">
                  <div className="fill"></div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="list-with-des chev">
          {isEmpty && (
            <div className="padding-page">
              <div className="icon-title">
                <div className="icon premium">
                  <div>
                    <span></span>
                  </div>
                </div>
                <h2>دسته بندی یافت نشد!</h2>
                <p>متاسفانه هنوز در این شهر کسب و کاری ثبت نشده است.</p>
              </div>
            </div>
          )}

          {subCategoryStep && (
            <Link
              to={{
                pathname: `/category/${selectedCategory.slug}`,
                state: { allCats: "true" },
              }}
              className="simple-options select-cat-options"
            >
              <div className="option">
                <h4>مشاهده همه</h4>
                <div className="chev-icon"></div>
              </div>
            </Link>
          )}

          {!isLoading && !error && !subCategoryStep && categories !== []
            ? categories.map((category, index) => {
                if (category.childCats.length !== 0) {
                  return (
                    <div
                      key={index}
                      className="option"
                      onClick={showSubCategories.bind(this, category._doc)}
                    >
                      <div>
                        <h4>{category._doc.title}</h4>
                        {/* prettier-ignore */}
                        <span>
                      {category.childCats.map((childCat) => childCat.title).join(" ").length > 35 ?
                      category.childCats.map((childCat) => childCat.title).join(" ").substring(0,35) + " ...":
                      category.childCats.map((childCat) => childCat.title).join(" ")                    
                    }
                    </span>
                      </div>
                      <cite></cite>
                    </div>
                  );
                }
              })
            : subCategories.map((subCat, key) => (
                <Link
                  to={`/category/${subCat._id}`}
                  key={key}
                  className="simple-options select-cat-options"
                >
                  <div className="option">
                    <h4>{subCat.title}</h4> <div className="chev-icon"></div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
      <FooterMenu activeItem={"category"} />
    </>
  );
}

export default CategoriesPage;
