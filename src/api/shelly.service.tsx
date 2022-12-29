import { ShellyDataRoot } from '../models/Shelly/data.models';
import { useAuthContext } from '../context/auth.context';
import axios from 'axios';
import { format } from 'date-fns';
import { Device, ShellyDevice, ShellyDeviceRoot } from '../models/Shelly/device.models';

export const shellyUrl = 'https://shelly-44-eu.shelly.cloud';

export interface UseShellyEndpoint {
  getDevices: (token: string) => Promise<ShellyDevice[]>;
  getConsumption: (year: number, month: number) => Promise<ShellyDataRoot>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { shellyToken, device } = useAuthContext();

  const getFirstDay = (year: number, month: number) => {
    const date = new Date(year, month);
    const firstDay = new Date(date.getFullYear(), month, 1);

    return format(firstDay, 'yyyy-MM-dd');
  };

  const getLastDay = (year: number, month: number) => {
    const date = new Date(year, month);
    const lastDay = new Date(date.getFullYear(), month + 1, 0);

    lastDay.setDate(lastDay.getDate());

    return format(lastDay, 'yyyy-MM-dd');
  };

  const getDevices = async (token: string): Promise<ShellyDevice[]> => {
    const { data } = await axios.post<ShellyDeviceRoot>(`${shellyUrl}/interface/device/get_all_lists`, null, {
      params: {
        auth_key: token
      }
    });

    const devices = data.data.devices;

    const deviceNames = Object.values(devices).map((d: Device) => {
      return { value: d.id, label: d.name ?? d.id } as ShellyDevice;
    });

    return deviceNames;
  };

  const getConsumption = async (year: number, month: number): Promise<ShellyDataRoot> => {
    const firstDay = getFirstDay(year, month);
    let lastDay = getLastDay(year, month);

    lastDay += ' 23:59:59';

    const { data } = await axios.post<ShellyDataRoot>(
      `${shellyUrl}/statistics/relay/consumption?id=${device}&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}`,
      null,
      {
        params: {
          auth_key: shellyToken
        }
      }
    );

    return data;
  };

  return { getDevices, getConsumption };
};
