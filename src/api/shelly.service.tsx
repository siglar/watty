import { ShellyDataRoot } from "../models/Shelly/data.models";
import { useAuthContext } from "../context/auth.context";
import axios from "axios";
import { format } from "date-fns";
import { Device, ShellyDeviceRoot } from "../models/Shelly/device.models";

export const shellyUrl = "https://shelly-44-eu.shelly.cloud";

export interface UseShellyEndpoint {
  getDevices: (token: string) => Promise<string[]>;
  getConsumption: (month: number) => Promise<ShellyDataRoot>;
  canLogin: (token: string) => Promise<boolean>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { shellyToken, device } = useAuthContext();

  const getDay = (month: number) => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), month, 1);

    return format(firstDay, "yyyy-MM-dd");
  };

  const getLastDay = (month: number) => {
    const date = new Date();
    const lastDay = new Date(date.getFullYear(), month + 1, 0);

    lastDay.setDate(lastDay.getDate() + 1);

    return format(lastDay, "yyyy-MM-dd");
  };

  const getDevices = async (token: string): Promise<string[]> => {
    const { data } = await axios.post<ShellyDeviceRoot>(
      `${shellyUrl}/device/all_status?show_info=true&no_shared=true&auth_key=${token}`,
      null
    );

    const devices = data.data.devices_status;

    const deviceNames = Object.values(devices).map(
      (d: Device) => d._dev_info.id
    );

    return deviceNames;
  };

  const getConsumption = async (month: number): Promise<ShellyDataRoot> => {
    const firstDay = getDay(month);
    const lastDay = getLastDay(month);

    const { data } = await axios.post<ShellyDataRoot>(
      `${shellyUrl}/statistics/relay/consumption?id=${device}&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}`,
      null,
      {
        params: {
          auth_key: shellyToken,
        },
      }
    );

    return data;
  };

  const canLogin = async (token: string): Promise<boolean> => {
    const month = new Date().getMonth();
    const firstDay = getDay(month);
    const lastDay = getLastDay(month);

    const { status } = await axios.post(
      `${shellyUrl}/statistics/relay/consumption?id=28d566&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}`,
      null,
      {
        params: {
          auth_key: token,
        },
      }
    );

    return status === 200;
  };

  return { getDevices, getConsumption, canLogin };
};
