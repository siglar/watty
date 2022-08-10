import axios from "axios";
import jwtDecode from "jwt-decode";
import { ShellyToken } from "../models/shelly.token";
import sha1 from "crypto-js/sha1";
import { shellyUrl } from "../api/shelly.service";

// const getBearerToken = async (): Promise<string> => {
//   var hash = sha1("RoflMao1988").toString();

//   const response = await fetch(
//     `https://api.shelly.cloud/auth/login?email=larsen.sigve%40gmail.com&password=${hash}&var=2`,
//     {
//       method: "POST",
//     }
//   );

//   const tokenObject = await response.json();

//   localStorage.setItem("shelly_token", tokenObject.data.token);
//   return tokenObject.data.token;
// };

// const getAccessToken = async () => {
//   let bearer = localStorage.getItem("shelly_token") ?? "";

//   if (bearer.length > 0) {
//     const decodedToken = jwtDecode(bearer) as ShellyToken;
//     if (Date.now() >= decodedToken.exp * 1000) {
//       // Token is invalid. Retrieve new one.
//       bearer = await getBearerToken();
//     }
//   } else {
//     // No token found. Retrieve new one.
//     bearer = await getBearerToken();
//   }

//   return bearer;
// };

axios.interceptors.request.use(
  async (config) => {
    if (config.url?.includes(shellyUrl + "/statistics")) {
      config.headers = {
        Authorization: `Bearer ${localStorage.getItem("shelly_token")}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axios;
