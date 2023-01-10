import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function AddStoryForm() {
  const token = localStorage.getItem("token");
  const params = useParams();

  const [storyPicAddress, setStoryPicAddress] = useState();
  const [storyPic, setStoryPic] = useState();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function changeImageHandler(event) {
    setStoryPicAddress(URL.createObjectURL(event.target.files[0]));
    setStoryPic(event.target.files[0]);
  }

  async function AddStory(event) {
    const formData = new FormData();
    formData.append("destination", "story");
    if (storyPic !== undefined) {
      formData.append("hasImage", "true");
      formData.append("image", storyPic);
    }

    event.preventDefault();
    
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/story/addStory/" + params.businessId,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
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
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon story">
            <div>
              <span></span>
            </div>
          </div>
          <h2>افزودن استوری</h2>
          <p>تصویر استوری خود را در زیر آپلود نمایید.</p>
        </div>

        <form
          onSubmit={AddStory}
          className="regular-form"
          style={{ marginTop: "5rem" }}
        >
          {/* FORM INPUT */}
          <div className="upload-images">
            <div className="edit-one-img">
              <div className="uploaded-image">
                <div
                  className="uploaded-image-itself"
                  style={{
                    backgroundImage: `url(${storyPicAddress})`,
                  }}
                ></div>
                <div className="remove-image">حذف</div>
              </div>
              <div className="upload-image-box">
                <input
                  onChange={(e) => changeImageHandler(e)}
                  className="image-input"
                  type="file"
                  name="image"
                  accept="image/*"
                />
                <span>آپلود تصویر</span>
                <div></div>
              </div>
            </div>
          </div>

          <input
            className="button form-btn"
            type="submit"
            style={{ marginTop: "5rem" }}
            value="ارسال استوری برای بازبینی و انتشار"
          />
        </form>
      </div>
    </>
  );
}

export default AddStoryForm;
