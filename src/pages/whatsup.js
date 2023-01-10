import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import moment from "moment";
import UnderConstruction from "../components/under-construction";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import GetProductModal from "../modals/get-product";
import { useSelector, useDispatch } from "react-redux";
import GetPostModal from "../modals/get-post";
import FooterMenu from "../components/footer-menu";
import { upgradeChanges } from "../data/upgrade-changes";

function WhatsUpPage() {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestProducts, setLatestProducts] = useState();
  const [latestUsers, setLatestUsers] = useState();
  const [latestBusinesses, setLatestBusinesses] = useState();
  const [latestPosts, setLatestPosts] = useState();

  async function FetchWhatsUp() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/WhatsUp", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("خطایی در دریافت اطلاعات وجود داشت!");
      }
      const data = await response.json();
      if (data.state === "Ok") {
        setLatestProducts(data.result.latestProducts);
        setLatestUsers(data.result.latestUsers);
        setLatestBusinesses(data.result.latestBusinesses);
        setLatestPosts(data.result.latestPosts);
      }
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchWhatsUp();
  }, []);

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>تازه ترین ها</h2>
      </div>

      <div
        className="whatsup-page"
        style={{
          paddingTop: "8rem",
          backgroundColor: isLoading ? "white" : "var(--bg-gray)",
        }}
      >
        {isLoading && (
          <>
            <div className="icon-title" style={{ marginTop: "5rem" }}>
              <div className="icon diamond ">
                <div>
                  <span className="loading-rotate"></span>
                </div>
              </div>
            </div>
            <div className="animated-fillbar">
              <h5>لطفا منتظر باشید...</h5>
              <p>در حال دریافت اطلاعات</p>
              <div className="bar">
                <div className="fill"></div>
              </div>
            </div>
          </>
        )}

        {!isLoading && (
          <>
            <div className="title-line-sec">
              <h4>آخرین کاربران</h4>
              <div className="line"></div>
            </div>

            <div className="new-users-flx">
              {latestUsers?.map((user, index) => (
                <Link
                  to={`/user/${user.slug}`}
                  className="new-user-item"
                  key={index}
                >
                  <div className="bu-image">
                    <div className="has-story">
                      <span
                        style={{
                          backgroundImage: `url(http://localhost:8080/uploads/user/${user.pic})`,
                        }}
                      ></span>
                    </div>
                  </div>
                  <div className="des">
                    <h5>{user.name}</h5>
                    <span>{user.slug}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="title-line-sec">
              <h4>آخرین محصولات</h4>
              <div className="line"></div>
            </div>

            <div className="new-products-flx">
              {latestProducts?.map((product, index) => (
                <Link
                  to={`business/${product.forBusinessSlug}`}
                  className="new-product-item"
                  key={index}
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/product/${product.pic})`,
                  }}
                >
                  {/* <div className="img"></div> */}
                  <div className="des">
                    <h5>{product.name}</h5>
                    <span>{product.forBusinessName}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="title-line-sec">
              <h4>آخرین پست ها</h4>
              <div className="line"></div>
            </div>

            <div className="new-products-flx">
              {latestPosts?.map((post, index) => (
                <Link
                  to={`user/${post.userSlug}`}
                  className="new-product-item"
                  key={index}
                  style={{
                    backgroundImage: `url(http://localhost:8080/uploads/post/${post.pic})`,
                  }}
                >
                  {/* <div className="img"></div> */}
                  <div className="des">
                    <h5>{post.title}</h5>
                    <span>{post.creatorName}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="title-line-sec">
              <h4>آخرین کسب و کارها</h4>
              <div className="line"></div>
            </div>

            <div className="new-businesses-flx">
              {latestBusinesses?.map((business, index) => (
                <Link
                  to={`business/${business.slug}`}
                  className="new-business-item"
                  key={index}
                >
                  <div className="bu-image">
                    <div className="has-story">
                      <span
                        style={{
                          backgroundImage: `url(http://localhost:8080/uploads/business/${business.pic})`,
                        }}
                      ></span>
                    </div>
                  </div>
                  <h5>{business.name}</h5>
                  <span>{business.name}</span>
                </Link>
              ))}
            </div>

            <div className="title-line-sec">
              <h4>آخرین آپدیت های ویترینی</h4>
              <div className="line"></div>
            </div>

            <div className="new-updates-flx">
              {upgradeChanges?.map((item, index) => (
                <div className="new-update-item" key={index}>
                  <div className="top-flx">
                    <h6>{item.title}</h6>
                    <span></span>
                  </div>
                  <div className="items">
                    {item.changes.map((change, key) => (
                      <div key={key}>
                        <span></span>
                        <p>{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <FooterMenu paddingBG={isLoading ? "false" : "true"} />
    </>
  );
}

export default WhatsUpPage;
