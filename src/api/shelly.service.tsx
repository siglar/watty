import { ShellyRoot } from "../models/shelly.models";
import sha1 from "crypto-js/sha1";
import { useAuthContext } from "../context/auth.context";
import axios from "axios";
import { format } from "date-fns";

export const shellyUrl = "https://shelly-44-eu.shelly.cloud";

export interface UseShellyEndpoint {
  logIn: (userName: string, password: string) => Promise<boolean>;
  getConsumption: (month: number) => Promise<ShellyRoot>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { setShellyToken, shellyToken } = useAuthContext();

  const getDay = (month: number) => {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), month, 1);

    return format(firstDay, "yyyy-MM-dd");
  };

  const getLastDay = (month: number) => {
    const date = new Date();
    var lastDay = new Date(date.getFullYear(), month + 1, 0);

    return format(lastDay, "yyyy-MM-dd");
  };

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
      console.log(error);
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

  const getConsumption = async (month: number): Promise<ShellyRoot> => {
    const firstDay = getDay(month);
    const lastDay = getLastDay(month);

    const { data } = await axios.post(
      `${shellyUrl}/statistics/relay/consumption?id=28d566&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}`,
      null,
      { headers: { Authorization: shellyToken } }
    );

    return data;
  };

  return { logIn, getConsumption };
};
