import React, { useEffect, useState } from "react";
import { render } from "@testing-library/react";
import {
  BrowserRouter,
  Redirect,
  useHistory,
  useParams,
  Link,
} from "react-router-dom";

function ConnectToInsta() {
  const history = useHistory();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState();
  const [page, setPage] = useState();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  function ConnectInsta() {
    return render(
      <BrowserRouter>
        <Redirect
          to="/importInstaPosts"
          businessId={selectedBusiness}
          page={page}
        />
      </BrowserRouter>
    );
  }

  async function FetchBusinesses() {
    
    setError(null);
    
      try {
        const response = await fetch("http://localhost:8080/businesses/");

        if (!response.ok) {
          throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
        }

        const data = await response.json();
        setBusinesses(data.businesses);
        setIsLoading(false);
        
      } catch (error) {
        setError(error.message);
      }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchBusinesses();
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>وارد کردن پست های اینستا</h2>
      </div>
      <div className="padding  import-insta-page">
        <p className="description-p">
          شما میتوانید پست های مربوط به محصولات خود را از این قسمت به
          <span> رستوران شهرزاد </span>
          اضافه نمایید.
        </p>

        <form className="regular-form">
          {/* FORM INPUT */}
          <div className="form-field">
            <div className="input-label">آدرس صفحه اینستاگرام</div>
            <div className="form-input">
              <input
                onChange={(e) => setPage(e.target.value)}
                name="page"
                type="text"
                placeholder="عنوان آدرس پیج اینستاگرامی"
              />
              <div className="input-check"></div>
            </div>
            
          </div>

          <div
            style={{ marginTop: "5rem" }}
            onClick={ConnectInsta}
            className="button"
          >
            پیدا کردن پست ها
          </div>
        </form>
      </div>
    </>
  );
}

export default ConnectToInsta;
