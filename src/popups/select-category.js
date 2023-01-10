import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function SelectCategoryPopup(props) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryStep, setSubCategoryStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function showSubCategories(slug) {
    setSubCategories([]);
    setSubCategoryStep(true);
    const givenIndexOfCategory = categories.findIndex(
      (category) => category._doc.slug === slug
    );
    const subCategoriesList = categories[givenIndexOfCategory].childCats;
    setSubCategories(subCategoriesList);
  }

  async function FetchCategories() {
    
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/getCategories");

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }

      const data = await response.json();
      setCategories(data.result);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchCategories();
  }, []);

  const popupClasses = [
    "popup ",
    props.show === "entering"
      ? "pop-up"
      : props.show === "exiting"
      ? "pop-down"
      : null,
  ];

  return (
    <>
      <div className={popupClasses.join(" ")}>
        <div className="popup-top">
          <h2>انتخاب دسته بندی</h2>
          <span id="close-popup" onClick={props.popupClose}></span>
        </div>

        <div className="popup-scroll">
          {!isLoading && !error && !subCategoryStep && categories !== []
            ? categories.map((category, index) => (
                <div
                  onClick={showSubCategories.bind(this, category._doc.slug)}
                  key={index}
                  className="simple-options select-cat-options"
                >
                  <div className="option">
                    <h4>{category._doc.title}</h4>{" "}
                    <div className="chev-icon"></div>
                  </div>
                </div>
              ))
            : subCategories.map((subCat, key) => (
                <div
                  onClick={props.setCategory.bind(this, {
                    name: subCat.title,
                    slug: subCat.slug,
                    id: subCat._id,
                  })}
                  key={key}
                  className="simple-options select-cat-options"
                >
                  <div className="option">
                    <h4>{subCat.title}</h4> <div className="chev-icon"></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default SelectCategoryPopup;
