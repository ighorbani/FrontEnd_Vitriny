function FillingBar(props) {
  return (
    <div className="loading-page">
      <div className="icon-title">
        <div className="icon invoice">
          <div>
          <span className="loading-rotate"></span>
          </div>
        </div>
      </div>

      <div className="animated-fillbar">
        {/* <p>{props.des}</p>
        <h5>{props.title}</h5> */}
        <h5>لطفا منتظر باشید...</h5>
        <p>در حال دریافت اطلاعات</p>
        <div className="bar">
          <div className="fill"></div>
        </div>
      </div>
    </div>
  );
}

export default FillingBar;
