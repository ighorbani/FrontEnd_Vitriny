import { useHistory, useParams, Link } from "react-router-dom";

function SelectProductPresentation() {
  const params = useParams();
  const history = useHistory();
  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>نوع نمایش محصول</h2>
      </div>

      <div className="padding add-product-page">
        <p className="description-p">
          لطفا یک نوع نمایش محصول / خدمت انتخاب کنید.
        </p>
      </div>
      <Link
        to={`/addProduct/${params.businessId}`}
        className="products-presentations"
      >
        <div className="present-model">
          <div className="present-top-flx">
            <h5>نمایش با ویژگی و قیمت</h5>
            <div className="add-icon-btn"></div>
          </div>
          <div className="present-preview price-with-feature">
            <div></div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default SelectProductPresentation;
