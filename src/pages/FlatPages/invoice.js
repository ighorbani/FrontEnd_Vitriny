import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function InvoicePage() {
  const params = useParams();

  const [businessInfo, setBusinessInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  async function FetchBusiness() {
    
    setError(null);
    
      try {
        const response = await fetch(
          "http://localhost:8080/business/" + params.businessId
        );

        if (!response.ok) {
          throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
        }

        const data = await response.json();
        setBusinessInfo(data.business);
        setIsLoading(false);
        
      } catch (error) {
        setError(error.message);
      }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchBusiness();
  }, []);

  return (
    <>
      {!isLoading && !error && businessInfo && (
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon invoice">
              <div>
                <span></span>
              </div>
            </div>
            <h2>بسته یکساله پرمیوم</h2>
            <p>{businessInfo.businessInfo.title}</p>
          </div>

          <div className="invoice">
            <div className="invoice-row">
              <h5>محصول</h5>
              <span>بسته پرمیوم یکساله ویترینی</span>
            </div>

            <div className="invoice-row">
              <h5>قیمت</h5>
              <span>120.000 تومان</span>
            </div>

            <div className="invoice-row">
              <h5>مدت زمان پایان اعتبار</h5>
              <span>1403/06/23</span>
            </div>

            <div className="invoice-row">
              <h5>کسب و کار</h5>
              <span>{businessInfo.businessInfo.title}</span>
            </div>
          </div>

          <Link to="" className="button">
            پرداخت 120.000 تومان
          </Link>
        </div>
      )}
    </>
  );
}

export default InvoicePage;
