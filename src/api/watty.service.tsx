import axios from 'axios';
import { useAuthContext } from '../context/auth.context';
import { StromAggregationEnum } from '../enums/stromAggregation.enum';
import { StromZoneEnum } from '../enums/stromZone.enum';
import { getFirstDay, getLastDay } from '../helpers/date.helpers';
import { Tokens } from '../models/tokens.models';
import { ConsumptionDay } from '../models/Watty/consumptionDay';

let wattyApiUrl = '';
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  wattyApiUrl = 'https://localhost:7040';
} else {
  wattyApiUrl = 'https://watty.azurewebsites.net';
}

export interface UseWattyEndpoint {
  /**
   * Add new user
   * @param email
   * @param name
   * @param password
   * @param shellyToken
   * @param tibberToken
   * @returns True if user added
   */
  addUser: (email: string, name: string, password: string, shellyToken: string, tibberToken: string) => Promise<boolean>;

  /**
   * Authorize user
   * @param email
   * @param password
   * @returns Tokens if authorized
   */
  authorize: (email: string, password: string) => Promise<Tokens>;

  /**
   * Get prices with consumption for a zone from one date to another
   * @param stromZoneEnum
   * @param deviceId
   * @param year
   * @param month
   * @returns Consumption data
   */
  getConsumption: (
    stromZoneEnum: StromZoneEnum,
    aggregation: StromAggregationEnum,
    deviceId: string,
    year: number,
    month: number
  ) => Promise<ConsumptionDay[]>;
}

export const useWattyEndpoint = (): UseWattyEndpoint => {
  const { tokens } = useAuthContext();

  const addUser = async (email: string, name: string, password: string, shellyToken: string, tibberToken: string): Promise<boolean> => {
    const result = await axios({
      url: `${wattyApiUrl}/User/Auth/Add`,
      method: 'POST',
      data: {
        email: email,
        name: name,
        password: password,
        shellyToken: shellyToken,
        tibberToken: tibberToken
      }
    });

    return result.status === 200;
  };

  const authorize = async (email: string, password: string): Promise<Tokens> => {
    const result = await axios({
      url: `${wattyApiUrl}/User/Auth/Authorize`,
      method: 'POST',
      data: {
        email: email,
        password: password
      }
    });

    return result.data;
  };

  const getConsumption = async (
    stromZoneEnum: StromZoneEnum,
    aggregation: StromAggregationEnum,
    deviceId: string,
    year: number,
    month: number
  ): Promise<ConsumptionDay[]> => {
    const firstDay = getFirstDay(year, month);
    const lastDay = getLastDay(year, month);

    const result = await axios({
      url: `${wattyApiUrl}/Strom/consumption/${stromZoneEnum}`,
      method: 'GET',
      params: {
        aggregation: aggregation,
        deviceId: deviceId,
        from: firstDay,
        to: lastDay
      },
      headers: { Authorization: tokens.wattyToken }
    });

    return result.data;
  };

  return { addUser, authorize, getConsumption };
};
