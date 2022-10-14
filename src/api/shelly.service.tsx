import { ShellyRoot } from "../models/shelly.models";
import { useAuthContext } from "../context/auth.context";
import axios from "axios";
import { format } from "date-fns";

export const shellyUrl = "https://shelly-44-eu.shelly.cloud";

export interface UseShellyEndpoint {
  getConsumption: (month: number) => Promise<ShellyRoot>;
  canLogin: (token: string) => Promise<boolean>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { shellyToken } = useAuthContext();

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

  const getConsumption = async (month: number): Promise<ShellyRoot> => {
    const firstDay = getDay(month);
    const lastDay = getLastDay(month);

    const { data } = await axios.post<ShellyRoot>(
      `${shellyUrl}/statistics/relay/consumption?id=28d566&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}&auth_key=${shellyToken}`,
      null
    );

    return data;
  };

  const canLogin = async (token: string): Promise<boolean> => {
    const month = new Date().getMonth();
    const firstDay = getDay(month);
    const lastDay = getLastDay(month);

    const { status } = await axios.post(
      `${shellyUrl}/statistics/relay/consumption?id=28d566&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}&auth_key=${token}`,
      null
    );

    return status === 200;
  };

  return { getConsumption, canLogin };
};
