import isLoggedInWrapper from "./loginWrapper.js";
import ServerAxios from "./serverAxios.js";

const createSniffer = isLoggedInWrapper(() => {
  ServerAxios.post("/sniffers");
});

export default createSniffer;
