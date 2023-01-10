import OptionWithIcon from "../components/option-with-icon";
import { useParams, Link } from "react-router-dom";
import FooterMenu from "../components/footer-menu";

function UnregisteredAccountPage() {
  return (
    <>
      <div className="top-menu-name">
        <Link to="/" className="back-menu"></Link>
        <h2>گزینه ها</h2>
      </div>

      <div className="padding" style={{ paddingTop: "8rem" }}>
        {/* prettier-ignore */}
        <Link to="/loginNumber/" className="button"> ورود </Link>

        {/* prettier-ignore */}
        <Link to="/registerBusiness" className="button green-outline">   ثبت کسب و کار  </Link>
      </div>

      <div className="options-with-icon">
        <OptionWithIcon
          link="/helpQuestions"
          iconClass="faq"
          notification={{ active: false, value: "" }}
          title="پرسش های متداول"
        />
        {/* 
        <OptionWithIcon
          link=""
          iconClass="location"
          notification={{ active: false, value: "" }}
          title="تغییر شهر"
        /> */}
      </div>
      <FooterMenu activeItem={"profile"} />
    </>
  );
}

export default UnregisteredAccountPage;
