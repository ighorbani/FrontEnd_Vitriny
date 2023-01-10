import "./App.css";

import {
  Switch,
  Route,
  useHistory,
  Redirect,
  useParams,
  Link,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./store/actions/userActions";
// import { USLocations } from "./data/locations";

//import pages
import NeedsUpdatePage from "./pages/FlatPages/needs-update";
import RequestBusinessPaymentForm from "./forms/request-business-payment";
import MyCartPage from "./pages/my-cart";
import InvoiceSinglePage from "./pages/invoice-single";
import FactorPayPage from "./pages/FlatPages/factor-pay";
import UserChatFactors from "./pages/user-chat-factors";
import AddFactorForm from "./forms/add-factor";
import AddProductForm from "./forms/add-product";
import AddPostForm from "./forms/add-post";
import ManageFactorsPage from "./pages/manage-factors";
import FinancialManagmentPage from "./pages/financial-managment";
import FilterCategory from "./popups/filter-category";
import SessionEndedPage from "./pages/FlatPages/session-ended";
import Question from "./components/question";
import SavedItems from "./pages/saved-items";
import CTAButtons from "./components/CTA-buttons";
import UnregisteredAccountPage from "./pages/account-unregistered";
import AccountPage from "./pages/account";
import BusinessAdminPage from "./pages/business-admin";
import BusinessViewPage from "./pages/business-view";
import CategoryPage from "./pages/cateogy";
import CategoriesPage from "./pages/categories";
import ChatPage from "./pages/chat";
import ChatsListPage from "./pages/chats-list";
import CommentsPage from "./pages/comments";
import HomePageFirst from "./pages/home-first-time";
import HomePageRegular from "./pages/home-regular";
import ProductsPage from "./pages/products";
import SearchPage from "./pages/search";
import StoryPage from "./pages/story";
import ReportRegistered from "./pages/FlatPages/reportRegistered";
import FillingBar from "./components/animated/filling-bar";
import RecentVisited from "./pages/recent-visited";
import Statistics from "./pages/statistics";
import SupportPage from "./pages/support-page";
import HelpQuestionsPage from "./pages/help-questions";
import WhatsUpPage from "./pages/whatsup";
import AppStatusPage from "./pages/FlatPages/appStatus";

// import flat pages
import BusinessCreatedPage from "./pages/FlatPages/business-created";
import InvoicePage from "./pages/FlatPages/invoice";
import LoginNumberPage from "./pages/FlatPages/login-first-number";
import LoginVerificationPage from "./pages/FlatPages/login-second-verification";
import PaymentFailedPage from "./pages/FlatPages/payment-failed";
import PaymentSuccedPage from "./pages/FlatPages/payment-succed";
import LoginRegistrationPage from "./pages/FlatPages/login-third-registration";
import BusinessHidedPage from "./pages/FlatPages/business-hided";
import SignOut from "./pages/FlatPages/sign-out";
import UserHidedPage from "./pages/FlatPages/user-hided";

// import forms
import ConnectToInsta from "./forms/connet-to-insta";
import ImportInstaPosts from "./forms/import-insta-posts";
import AddAddressForm from "./forms/add-address";
import AddComment from "./forms/add-comment";
import AddFeatureForm from "./forms/add-feature";
import SelectProductPresentation from "./forms/select-product-presentation";
import RegisterBusinessForm from "./forms/register-business";
import RegisterBugForm from "./forms/register-bug";
import EditUserForm from "./forms/edit-user";
import EditBusinessForm from "./forms/edit-business";
import AddStoryForm from "./forms/add-story";
import BugReportPage from "./forms/bug-report";
import AddSocialFrom from "./forms/add-social";
import AddPhoneForm from "./forms/add-phone";
import NotFound from "./pages/FlatPages/not-found";
import UserAdminPage from "./pages/user-page-admin";
import EditUserPageForm from "./forms/edit-user-page";
import UserViewPage from "./pages/user-page-view";
import AddUserSocialFrom from "./forms/add-user-social";

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  // const userNumber = useSelector((state) => state.user.userInfo.number);
  const [signedIn, setSignedIn] = useState(false);
  const [choosedLocation, setChoosedLocation] = useState(false);

  function GetUserFromStorage() {
    const storageUserLocation = JSON.parse(
      localStorage.getItem("userLocation")
    );
    if (storageUserLocation) {
      setChoosedLocation(true);
    }
    const storageUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storageUser) {
      setSignedIn(true);
      dispatch(setUser(storageUser));
    }
  }

  //DETECT IF NETWORK CONNECTION IS CLOSED
  useEffect(() => {
    if (!navigator.onLine) {
      history.push({
        pathname: "/appStatus",
        state: {
          title: "اینترنت متصل نیست !!!",
          description:
            "اپلیکیشن ویترینی نیاز به اتصال اینترنت دارد، لطفا دسترسی خود به اینترنت را بررسی نمایید.",
        },
      });
    }
  }, []);

  // function ConvertLocationData() {
  //   let locations = USLocations.map((city) => {
  //     return {
  //       id: Math.floor(
  //         100000000000000 + Math.random() * 900000000000000
  //       ).toString(),
  //       city: city.city,
  //       province: city.state_name,
  //     };
  //   });

  //   let provinces = locations.reduce((provinces, item) => {
  //     let province = provinces.find((p) => p.province === item.province);
  //     if (!province) {
  //       province = { province: item.province, cities: [] };
  //       provinces.push(province);
  //     }

  //     let city = province.cities.find((c) => c.city === item.city);

  //     if (!city) {
  //       city = { title: item.city, cityId: item.id };
  //       province.cities.push(city);
  //     }

  //     return provinces;
  //   }, []);

  //   let finalLocationJson = JSON.stringify(provinces);
  // }

  useEffect(() => {
    GetUserFromStorage();
    // ConvertLocationData();
  }, []);

  return (
    <>
      <Switch>
        {/* FORMS */}
        <Route path="/addAddress/">
          <AddAddressForm />
        </Route>
        <Route path="/editAddress/:addressId/">
          <AddAddressForm />
        </Route>

        <Route
          path="/addComment/"
          render={(props) => <AddComment {...props} />}
        />

        <Route
          path="/invoiceSingle/"
          render={(props) => <InvoiceSinglePage {...props} />}
        />

        <Route
          path="/addFactor/"
          render={(props) => <AddFactorForm {...props} />}
        />

        <Route path="/fillingBar">
          <FillingBar />
        </Route>

        <Route path="/requestBusinessPaymentForm">
          <RequestBusinessPaymentForm />
        </Route>

        <Route path="/factorPay">
          <FactorPayPage />
        </Route>

        <Route path="/myCart">
          <MyCartPage />
        </Route>

        <Route path="/userAdminPage">
          <UserAdminPage />
        </Route>

        {/* prettier-ignore */}
        <Route path="/signOut"> {signedIn ? <SignOut /> : <HomePageRegular />} </Route>

        <Route path="/filterCategory">
          <FilterCategory />
        </Route>

        <Route path="/sessionEnded">
          <SessionEndedPage />
        </Route>

        <Route path="/support">
          <SupportPage />
        </Route>

        <Route path="/financialManagment">
          <FinancialManagmentPage />
        </Route>

        <Route path="/factors">
          <ManageFactorsPage />
        </Route>

        <Route
          path="/appStatus"
          render={(props) => <AppStatusPage {...props} />}
        />

        <Route path="/editComment/:commentId">
          <AddComment />
        </Route>
        <Route
          path="/addFeature/"
          render={(props) => <AddFeatureForm {...props} />}
        />
        <Route path="/editFeature/:featureId/">
          <AddFeatureForm />
        </Route>
        {/* prettier-ignore */}
        <Route path="/registerBusiness"> {signedIn ? <RegisterBusinessForm /> : <LoginNumberPage />} </Route>
        <Route
          path="/registerBug"
          render={(props) => <RegisterBugForm {...props} />}
        />
        <Route path="/editUser/">
          <EditUserForm />
        </Route>

        <Route path="/editUserPage/">
          <EditUserPageForm />
        </Route>

        <Route path="/user/:slug">
          <UserViewPage />
        </Route>

        <Route
          path="/editBusiness"
          render={(props) => <EditBusinessForm {...props} />}
        />
        <Route path="/addStory/">
          <AddStoryForm />
        </Route>
        <Route
          path="/addSocial"
          render={(props) => <AddSocialFrom {...props} />}
        />

        <Route path="/editSocial/:socialId/">
          <AddSocialFrom />
        </Route>

        <Route path="/editUserSocial/:socialId/">
          <AddUserSocialFrom />
        </Route>

        <Route path="/addUserSocial">
          <AddUserSocialFrom />
        </Route>

        <Route
          path="/addProduct"
          render={(props) => <AddProductForm {...props} />}
        />
        <Route path="/editProduct/:productId">
          <AddProductForm />
        </Route>

        <Route path="/addPost">
          <AddPostForm />
        </Route>

        <Route path="/editPost/:postId">
          <AddPostForm />
        </Route>

        <Route path="/whatsup">
          <WhatsUpPage />
        </Route>

        <Route
          path="/userChatFactors"
          render={(props) => <UserChatFactors {...props} />}
        />
        <Route
          path="/addPhone/"
          render={(props) => <AddPhoneForm {...props} />}
        />
        <Route path="/editPhone/:phoneId/">
          <AddPhoneForm />
        </Route>
        <Route path="/connectToInsta">
          <ConnectToInsta />
        </Route>
        <Route path="/importInstaPosts">
          <ImportInstaPosts />
        </Route>
        {/* PAGES */}
        <Route path="/savedItems">
          <SavedItems />
        </Route>
        <Route path="/statistics">
          <Statistics />
        </Route>
        <Route path="/recentVisited">
          <RecentVisited />
        </Route>
        {/* prettier-ignore */}
        <Route path="/profile"> {signedIn ? <AccountPage /> : <UnregisteredAccountPage />} </Route>
        <Route path="/unregisteredProfile">
          <UnregisteredAccountPage />
        </Route>
        <Route path="/businessAdmin/:slug">
          <BusinessAdminPage />
        </Route>

        <Route path="/needsUpdate">
          <NeedsUpdatePage />
        </Route>

        <Route path="/business/:slug">
          <BusinessViewPage />
        </Route>
        <Route
          path="/category/:categoryId"
          render={(props) => <CategoryPage {...props} />}
        />

        {/* prettier-ignore */}
        <Route path="/categories"> {choosedLocation ? <CategoriesPage /> : <HomePageFirst />} </Route>

        <Route path="/helpQuestions">
          <HelpQuestionsPage />
        </Route>

        <Route path="/chats/">
          <ChatsListPage />
        </Route>
        <Route path="/chat" render={(props) => <ChatPage {...props} />} />
        <Route path="/cta/">
          <CTAButtons />
        </Route>
        <Route path="/comments/:businessId">
          <CommentsPage />
        </Route>
        {/* prettier-ignore */}
        <Route path="/" exact> {choosedLocation ? <HomePageRegular /> : <HomePageFirst />} </Route>
        <Route
          path="/bugReport"
          render={(props) => <BugReportPage {...props} />}
        />
        <Route path="/reportRegistered">
          <ReportRegistered />
        </Route>
        <Route path="/products/:businessId">
          <ProductsPage />
        </Route>
        <Route path="/search">
          <SearchPage />
        </Route>
        <Route path="/stories/:businessId">
          <StoryPage />
        </Route>
        {/* FLAT PAGES */}
        <Route path="/businessCreated/">
          <BusinessCreatedPage />
        </Route>
        <Route path="/invoice/">
          <InvoicePage />
        </Route>
        <Route path="/paymentFailed/">
          <PaymentFailedPage />
        </Route>

        <Route path="/businessStopped/:slug">
          <BusinessHidedPage />
        </Route>

        <Route path="/userStopped/:slug">
          <UserHidedPage />
        </Route>

        <Route path="/paymentSucced/">
          <PaymentSuccedPage />
        </Route>
        <Route path="/loginNumber/">
          <LoginNumberPage />
        </Route>

        {/* prettier-ignore */}
        <Route path="/loginVerification" render={(props) => { if (signedIn && choosedLocation) { return <HomePageRegular />; } else if(signedIn && !choosedLocation){  return <HomePageFirst />;} else { return <LoginVerificationPage {...props} />; } }} />
        {/* prettier-ignore */}
        <Route path="/loginName" render={(props) => { if (signedIn && choosedLocation) { return <HomePageRegular />; } else if(signedIn && !choosedLocation){  return <HomePageFirst />; } else { return <LoginRegistrationPage {...props} />; } }} />

        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
