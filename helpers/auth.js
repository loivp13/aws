import cookie from "js-cookie";
import Router from "next/router";

//set in cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

//remove from cookie
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};
//get from cookie such as stored token
//useful whenw eneed to amke request to server with auth token
export const getCookie = (key, req) => {
  //   }
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split("=")[1];
  console.log(token);
  return tokenValue;
};

//set inlocal storage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    //data stored in localStorage has to be a JSON file
    localStorage.setItem(key, JSON.stringify(value));
  }
};
//remove from local storage
export const removeLocalStorage = (key, value) => {
  if (process.browser) {
    //data stored in localStorage has to be a JSON file
    localStorage.removeItem(key);
  }
};

//authenticate user by passing data to cookie and localstorage during signing
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};
//acces user  info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));

      console.log(auth);
      // auth = user;
      localStorage.setItem("user", JSON.stringify(user));
      next();
    }
  }
};
