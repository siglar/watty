import axios from 'axios';
import { format } from 'date-fns';
import { useAuthContext } from '../context/auth.context';
import { StromAggregationEnum } from '../enums/stromAggregation.enum';
import { StromZoneEnum } from '../enums/stromZone.enum';
import { getFirstDay, getLastDay } from '../helpers/date.helpers';
import {
  FylkeLookupResult,
  GridCompanyLookupResult,
  UserSettings
} from '../models/lookup.models';
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
   * @returns True if user added
   */
  addUser: (email: string, name: string, password: string, shellyToken: string) => Promise<boolean>;

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

  /**
   * Get user settings (fylke and grid company)
   * @returns User settings for the authenticated user
   */
  getSettings: () => Promise<UserSettings>;

  /**
   * Update user settings (fylke and grid company)
   * @param settings - The settings to save
   */
  updateSettings: (settings: UserSettings) => Promise<void>;

  /**
   * Search fylker (counties) by name
   * @param search - Optional search query to filter fylker
   * @returns Matching fylker with fylkesnummer and fylkesnavn
   */
  getFylker: (search?: string) => Promise<FylkeLookupResult[]>;

  /**
   * Search electricity distribution companies by name
   * @param search - Search query (minimum 2 characters)
   * @returns Matching grid companies with organisasjonsnummer and navn
   */
  getGridCompanies: (search: string) => Promise<GridCompanyLookupResult[]>;
}

export const useWattyEndpoint = (): UseWattyEndpoint => {
  const { tokens } = useAuthContext();

  const addUser = async (email: string, name: string, password: string, shellyToken: string): Promise<boolean> => {
    const result = await axios({
      url: `${wattyApiUrl}/user/add`,
      method: 'POST',
      data: {
        email: email,
        name: name,
        password: password,
        shellyToken: shellyToken
      }
    });

    return result.status === 200;
  };

  const authorize = async (email: string, password: string): Promise<Tokens> => {
    const result = await axios({
      url: `${wattyApiUrl}/user/authorize`,
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

    const currentDate = new Date();
    let lastDay: string;

    const isCurrentMonth = currentDate.getFullYear() === year && currentDate.getMonth() === month;

    isCurrentMonth ? (lastDay = format(currentDate, 'yyyy-MM-dd')) : (lastDay = getLastDay(year, month));

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

  const getSettings = async (): Promise<UserSettings> => {
    const result = await axios({
      url: `${wattyApiUrl}/user/settings`,
      method: 'GET',
      headers: { Authorization: tokens.wattyToken }
    });
    return result.data;
  };

  const updateSettings = async (settings: UserSettings): Promise<void> => {
    await axios({
      url: `${wattyApiUrl}/user/settings`,
      method: 'PUT',
      data: settings,
      headers: { Authorization: tokens.wattyToken }
    });
  };

  const getFylker = async (search?: string): Promise<FylkeLookupResult[]> => {
    const result = await axios({
      url: `${wattyApiUrl}/lookup/fylke`,
      method: 'GET',
      params: search ? { search } : {}
    });
    return result.data;
  };

  const getGridCompanies = async (search: string): Promise<GridCompanyLookupResult[]> => {
    const result = await axios({
      url: `${wattyApiUrl}/lookup/grid-company`,
      method: 'GET',
      params: { search }
    });
    return result.data;
  };

  return { addUser, authorize, getConsumption, getSettings, updateSettings, getFylker, getGridCompanies };
};
