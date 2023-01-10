import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/userActions";

function AppContainer(props) {
  const dispatch = useDispatch();
  // const userNumber = useSelector((state) => state.user.userInfo.number);

  function GetUserFromStorage() {
    const storageUserLocation = JSON.parse(
      localStorage.getItem("userLocation")
    );
    if (storageUserLocation) {
      props.choosedLocation();
    }
    const storageUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storageUser) {
      props.signedUesr();
      dispatch(setUser(storageUser));
    }
  }

  useEffect(() => {
    GetUserFromStorage();
  }, []);

  return <>{props.children}</>;
}

export default AppContainer;
