import { ShellyRoot } from "../models/shelly.models";
import sha1 from "crypto-js/sha1";
import { useAuthContext } from "../context/auth.context";
import axios from "axios";

export const shellyUrl = "https://shelly-44-eu.shelly.cloud";

export interface UseShellyEndpoint {
  logIn: (userName: string, password: string) => Promise<boolean>;
  getConsumption: () => Promise<ShellyRoot>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { setShellyToken, shellyToken } = useAuthContext();

  const getBearerToken = async (
    userName: string,
    password: string
  ): Promise<string> => {
    const hash = sha1(password).toString();

    try {
      const { data } = await axios.post(
        `${shellyUrl}/auth/login?email=${userName}&password=${hash}&var=2`
      );

      return data.data.token;
    } catch (error) {
      return "";
    }
  };

  const logIn = async (
    userName: string,
    password: string
  ): Promise<boolean> => {
    const bearer = await getBearerToken(userName, password);
    if (bearer.length > 0) {
      setShellyToken("Bearer " + bearer);
      return true;
    }

    return false;
  };

  const getConsumption = async (): Promise<ShellyRoot> => {
    const { data } = await axios.post(
      `${shellyUrl}/statistics/relay/consumption?id=28d566&channel=0&date_range=custom&date_from=2022-08-01&date_to=2022-08-31`,
      null,
      { headers: { Authorization: shellyToken } }
    );

    return data;
  };

  return { logIn, getConsumption };
};
