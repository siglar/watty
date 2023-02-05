import { ShellyDataRoot } from '../models/Shelly/data.models';
import { useAuthContext } from '../context/auth.context';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import { Device, ShellyDevice, ShellyDeviceRoot } from '../models/Shelly/device.models';
import { useNavigate } from 'react-router';

export const shellyUrl = 'https://shelly-44-eu.shelly.cloud';

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

export interface UseShellyEndpoint {
  getDevices: (token: string) => Promise<ShellyDevice[]>;
  getConsumption: (deviceId: string, year: number, month: number) => Promise<ShellyDataRoot | null>;
}

export const useShellyEndpoint = (): UseShellyEndpoint => {
  const { tokens } = useAuthContext();
  const shellyToken = tokens.shellyToken;
  const navigate = useNavigate();

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

  const getConsumption = async (deviceId: string, year: number, month: number): Promise<ShellyDataRoot | null> => {
    const firstDay = getFirstDay(year, month);
    let lastDay = getLastDay(year, month);

    lastDay += ' 23:59:59';

    try {
      const result = await axios.post<ShellyDataRoot>(
        `${shellyUrl}/statistics/relay/consumption?id=${deviceId}&channel=0&date_range=custom&date_from=${firstDay}&date_to=${lastDay}`,
        null,
        {
          params: {
            auth_key: shellyToken
          }
        }
      );

      return result.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 400) {
        navigate('/');
      }
      return null;
    }
  };

  return { getDevices, getConsumption };
};
