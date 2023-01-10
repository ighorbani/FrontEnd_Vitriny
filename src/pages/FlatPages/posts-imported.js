import { useParams, Link } from "react-router-dom";

function PostsImportedPage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon success">
            <div>
              <span></span>
            </div>
          </div>
          <h2>پست ها با موفقیت وارد شد.</h2>
          <p>
            اکنون میتوانید در صفحه کسب و کار محصولات، خدمات و سایر اطلاعات را
            اضافه کنید.
          </p>
        </div>

        <Link
          to={`/businessAdmin/${params.businessId}`}
          className="button green-outline"
        >
          بازگشت به کسب و کار
        </Link>
      </div>
    </>
  );
}

export default PostsImportedPage;
