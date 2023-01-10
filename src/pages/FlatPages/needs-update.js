import { useParams, Link } from "react-router-dom";

function NeedsUpdatePage() {
  const params = useParams();

  return (
    <>
      <div className="padding-page">
        <div className="icon-title">
          <div className="icon premium">
            <div>
              <span></span>
            </div>
          </div>
          <h2>نیاز به بروز رسانی</h2>
          <p>
            این نسخه از اپلیکیشن ویترینی نیاز به بروز رسانی دارد. لطفا از طریق
            اپ استورها آن را آپدیت نمایید یا از نسخه وب اپلیکیشن استفاده نمایید.
          </p>
        </div>

        <a
          href="https://vitriny.ir"
          className="button black"
          style={{ marginTop: "10rem" }}
          target="_blank"
        >
          استفاده از نسخه وب
        </a>
      </div>
    </>
  );
}

export default NeedsUpdatePage;
