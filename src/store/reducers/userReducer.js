import {
  SET_USER,
  SET_SEENED_STORIES,
  SET_SEENED_POSTS,
  SET_LIKED_STORIES,
  SET_LIKED_PRODUCTS,
  SET_LIKED_POSTS,
  SET_FOLLOWED_BUSINESSES,
  SET_FOLLOWING_USERS,
  SET_ACTIVE_BUSINESS,
  CHANGE_SETTINGS,
  EDIT_USER,
} from "../actions/userActions";

let userObject = {};

const initialUser = {
  deleted: false,
  banned: false,
  userInfo: {
    name: "",
    pic: "",
    number: "",
    id: "",
  },
  activeBusiness: {
    title: "",
    slug: "",
    id: "",
  },
  followedBusinesses: [],
  followingUsers: [],
  seenedStories: [],
  likedStories: [],
  seenedPosts: [],
  likedPosts: [],
  likedProducts: [],
  settings: {
    seen: { weAreIndependent: false },
  },
};

const userReducer = (state = initialUser, action) => {
  switch (action.type) {
    // SET_USER
    case SET_USER:
      userObject = {
        ...state,
        deleted: action.newUser.deleted,
        banned: action.newUser.banned,
        userInfo: {
          name: action.newUser.userInfo.name,
          pic: action.newUser.userInfo.pic,
          number: action.newUser.userInfo.number,
          id: action.newUser._id || action.newUser.userInfo.id,
          slug: action.newUser.userInfo.slug,
          aboutMe: action.newUser.userInfo.aboutMe,
        },
        followedBusinesses: action.newUser.followedBusinesses,
        followingUsers: action.newUser.followingUsers,
        seenedStories: action.newUser.seenedStories,
        seenedPosts: action.newUser.seenedPosts,
        likedStories: action.newUser.likedStories,
        likedPosts: action.newUser.likedPosts,
        likedProducts: action.newUser.likedProducts,
        settings: action.newUser.settings,
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // EDIT_USER
    case EDIT_USER:
      userObject = {
        ...state,
        userInfo: {
          ...state.userInfo,
          name: action.info.name,
          pic: action.info.pic,
          slug: action.info.slug,
          aboutMe: action.info.aboutMe,
        },
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_SEENED_STORIES
    case SET_SEENED_STORIES:
      userObject = {
        ...state,
        seenedStories: state.seenedStories.concat(action.info.id),
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_SEENED_POSTS
    case SET_SEENED_POSTS:
      userObject = {
        ...state,
        seenedPosts: state.seenedPosts.concat(action.info.id),
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_LIKED_STORIES
    case SET_LIKED_STORIES:
      if (action.info.liked) {
        userObject = {
          ...state,
          likedStories: state.likedStories.concat(action.info.id),
        };
      } else {
        userObject = {
          ...state,
          likedStories: state.likedStories.filter(
            (id) => id !== action.info.id
          ),
        };
      }
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_LIKED_PRODUCTS
    case SET_LIKED_PRODUCTS:
      if (action.info.liked) {
        userObject = {
          ...state,
          likedProducts: state.likedProducts.concat(action.info.id),
        };
      } else {
        userObject = {
          ...state,
          likedProducts: state.likedProducts.filter(
            (id) => id !== action.info.id
          ),
        };
      }
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_LIKED_POSTS
    case SET_LIKED_POSTS:
      if (action.info.liked) {
        userObject = {
          ...state,
          likedPosts: state.likedPosts.concat(action.info.id),
        };
      } else {
        userObject = {
          ...state,
          likedPosts: state.likedPosts.filter((id) => id !== action.info.id),
        };
      }
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_FOLLOWED_BUSINESSES
    case SET_FOLLOWED_BUSINESSES:
      if (action.info.liked) {
        userObject = {
          ...state,
          followedBusinesses: state.followedBusinesses.concat(action.info.id),
        };
      } else {
        userObject = {
          ...state,
          followedBusinesses: state.followedBusinesses.filter(
            (id) => id !== action.info.id
          ),
        };
      }

      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_FOLLOWING_USERS
    case SET_FOLLOWING_USERS:
      if (action.info.liked) {
        userObject = {
          ...state,
          followingUsers: state.followingUsers.concat(action.info.id),
        };
      } else {
        userObject = {
          ...state,
          followingUsers: state.followingUsers.filter(
            (id) => id !== action.info.id
          ),
        };
      }

      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // SET_ACTIVE_BUSINESS
    case SET_ACTIVE_BUSINESS:
      userObject = {
        ...state,
        activeBusiness: action.info,
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    // CHANGE_SETTINGS
    case CHANGE_SETTINGS:
      userObject = {
        ...state,
        settings: action.info,
      };
      localStorage.setItem("userInfo", JSON.stringify(userObject));
      return userObject;

    default:
      return state;
  }
};

export default userReducer;
