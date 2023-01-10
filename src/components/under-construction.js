import { Link } from "react-router-dom";

function UnderConstruction() {
  return (
    <>
      <div className="padding-page" style={{ paddingTop: "10rem" }}>
        <div className="icon-title">
          <div className="icon under-construction">
            <div>
              <span></span>
            </div>
          </div>
          <h2>در دست ساخت!</h2>
          <p> این صفحه در دست ساخت است. از صبر و شکیبایی شما سپاسگزاریم!</p>
        </div>

        <Link
          to="/"
          className="button green-outline"
          style={{ marginTop: "4rem" }}
        >
          بازگشت به خانه
        </Link>
      </div>
    </>
  );
}

export default UnderConstruction;
