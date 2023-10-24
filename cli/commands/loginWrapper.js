import { loadLoginFromFile } from "./utils.js";

const isLoggedInWrapper = (fn) => {
  return (...args) => {
    const data = loadLoginFromFile();

    if (!data) {
      console.log("Please login first:\nsharkio login");
      return;
    }

    fn(...args);
  };
};

export default isLoggedInWrapper;
