export const SET_USER = "SET_USER";
export const SET_SEENED_STORIES = "SET_SEENED_STORIES";
export const SET_SEENED_POSTS = "SET_SEENED_POSTS";
export const SET_LIKED_STORIES = "SET_LIKED_STORIES";
export const SET_LIKED_PRODUCTS = "SET_LIKED_PRODUCTS";
export const SET_LIKED_POSTS = "SET_LIKED_POSTS";
export const SET_FOLLOWED_BUSINESSES = "SET_FOLLOWED_BUSINESSES";
export const SET_FOLLOWING_USERS = "SET_FOLLOWING_USERS";
export const SET_ACTIVE_BUSINESS = "SET_ACTIVE_BUSINESS";
export const CHANGE_SETTINGS = "CHANGE_SETTINGS";
export const EDIT_USER = "EDIT_USER";

export const setUser = (newUser) => {
  return { type: SET_USER, newUser: newUser };
};

export const editUser = (info) => {
  return { type: EDIT_USER, info: info };
};

export const setSeenedStories = (info) => {
  return { type: SET_SEENED_STORIES, info: info };
};

export const setSeenedPosts = (info) => {
  return { type: SET_SEENED_POSTS, info: info };
};

export const setLikedStories = (info) => {
  return { type: SET_LIKED_STORIES, info: info };
};

export const setLikedProducts = (info) => {
  return { type: SET_LIKED_PRODUCTS, info: info };
};

export const setLikedPosts = (info) => {
  return { type: SET_LIKED_POSTS, info: info };
};

export const setFollowedBusinesses = (info) => {
  return { type: SET_FOLLOWED_BUSINESSES, info: info };
};

export const setFollowingUsers = (info) => {
  return { type: SET_FOLLOWING_USERS, info: info };
};

export const setActiveBusiness = (info) => {
  return { type: SET_ACTIVE_BUSINESS, info: info };
};

export const changeSettings = (info) => {
  return { type: CHANGE_SETTINGS, info: info };
};
