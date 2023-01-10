import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

function ImportInstaPosts(props) {
  const [productsInfo, setProductsInfo] = useState();
  const history = useHistory();
  const [instaPosts, setInstaPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  function SelectItemHandler(id) {
    const givenIndex = instaPosts.findIndex((post) => {
      return post.id === id;
    });

    setInstaPosts((prevState) => {
      prevState[givenIndex].is_selected = !prevState[givenIndex].is_selected;
    });
  }

  async function FetchInstaPosts() {
    
    setError(null);

    const url =
      "https://easy-instagram-service.p.rapidapi.com/username?username=" +
      "regular_ghorbani" +
      "&random=x8n3nsj2";

    
      try {
        // prettier-ignore
        const response = await fetch(url,{
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "78ac277a78msh21a19c946e2a2b6p14c7adjsn6965b1d1fcd8",
          },
        });
        // prettier-ignore
        if (!response.ok) {throw new Error("خطایی در دریافت اطلاعات وجود داشت!"); }

        const data = await response.json();
        
        setPageInfo({
          id: data.id,
          full_name: data.full_name,
          biography: data.biography,
          username: data.username,
          external_url: data.external_url,
          profile_pic_url: data.profile_pic_url,
        });

        // carousel_posts: [
        //   if(is_carousel){
        //     post.carousel_posts.map((carousel_post)=>{
        //     })
        //     {
        //       id: post.carousel_posts.id,
        //       shortcode: post.carousel_posts.shortcode,
        //       dimensions: {
        //         height: post.carousel_posts.dimensions.height,
        //         width: post.carousel_posts.dimensions.width,
        //       },
        //     },
        //   }
        // ],

        data.last_post.map((post) => {
          instaPosts.push({
            id: post.id,
            is_selected: false,
            follower: post.follower,
            timestamp_taken: post.timestamp_taken,
            shortcode: post.shortcode,
            caption: post.caption,
            display_url: post.display_url,
            username: post.username,
            user_id: post.user_id,
            is_video: post.is_video,
            is_carousel: post.is_carousel,
          });
        });
        setIsLoading(false);
        
      } catch (error) {
        setError(error.message);
      }

    setIsLoading(false);
  }

  useEffect(() => {
    FetchInstaPosts();
  }, []);

  async function RegisterProducts() {
    const Products = [];
    const InstaPageInfo = {
      id: pageInfo.id,
      full_name: pageInfo.full_name,
      biography: pageInfo.biography,
      username: pageInfo.username,
      external_url: pageInfo.external_url,
      profile_pic_url: pageInfo.profile_pic_url,
    };

    productsInfo.map((product, index) => {
      Products.push({
        price: "",
        description: product.caption,
        features: [],
        discounted: false,
        discountAmount: 0,
        discountPrice: 0,
        priceType: "تومان",
        presentType: "price-feature",
      });
    });

    
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/business/addFromInsta/" + props.businessId,
        {
          method: "POST",
          body: JSON.stringify({
            instaPageInfo: InstaPageInfo,
            products: Products,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      {!isLoading && !error && pageInfo && (
        <>
          <div className="top-menu-name">
            <div onClick={history.goBack} className="back-menu"></div>
            <h2>انتخاب پست ها</h2>
          </div>
          <div className="padding import-insta-page">
            <p className="description-p">
              لطفا پست های مورد نظر خود را برای وارد کردن در صفحه انتخاب نمایید.
            </p>
          </div>

          <div className="insta-page-sum">
            <div
              className="page-img"
              style={{
                backgroundImage: `url(${pageInfo.profile_pic_url})`,
              }}
            ></div>
            <h3 className="page-name">{pageInfo.full_name}</h3>
            <p>
              {pageInfo.follower}
              <span>دنبال کننده</span>
            </p>
          </div>

          <div className="check-all-flx">
            <div className="check-all">
              <span>
                <blockquote></blockquote>
              </span>
              <div>انتخاب همه پست ها</div>
            </div>
            <div className="posts-number">
              {instaPosts.length}
              پست{" "}
            </div>
          </div>

          <div className="select-posts-box">
            {instaPosts.map((instaPost, index) => {
              const imageBoxClasses = [
                "img-box ",
                instaPost.is_selected === false ? "selected" : null,
              ];
              return (
                <div
                  key={index}
                  data-id={instaPost.id}
                  className="post-select-item"
                  onClick={SelectItemHandler.bind(this, instaPost.id)}
                >
                  <div
                    className={imageBoxClasses.join(" ")}
                    style={{
                      backgroundImage: `url(${instaPost.display_url})`,
                    }}
                  ></div>
                  <span>
                    {instaPost.is_selected && <blockquote></blockquote>}
                  </span>
                </div>
              );
            })}
          </div>

          <div onClick={RegisterProducts} style={{ padding: "2rem 2rem" }}>
            <div className="button">افزودن بعنوان محصول</div>
          </div>
        </>
      )}
    </>
  );
}

export default ImportInstaPosts;
