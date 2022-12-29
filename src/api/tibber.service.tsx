import axios, { AxiosResponse } from 'axios';
import { getDaysInMonth } from 'date-fns';
import { useAuthContext } from '../context/auth.context';
import { getCursor } from '../helpers/tibber.helper';
import { Home, TibberRoot } from '../models/tibber.models';

const tibberUrl = 'https://api.tibber.com/v1-beta/gql';

export interface UseTibberEndpoint {
  getHomes: (token: string) => Promise<Home[]>;
  canLogin: (token: string) => Promise<boolean>;
  getTibberConsumption: (year: number, month: number) => Promise<TibberRoot>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken, homeId } = useAuthContext();

  const getHomes = async (token: string) => {
    const query = `{
      viewer {
        homes {
          address {
            address1
          }
          id
        }
      }
    }`;

    const result = (await axios({
      url: tibberUrl,
      method: 'POST',
      headers: {
        Authorization: token
      },
      data: {
        query: query
      }
    })) as AxiosResponse<TibberRoot>;

    return result.data.data.viewer.homes.map((home) => home);
  };

  const canLogin = async (token: string) => {
    const query = `{
      viewer {
        name
      }
    }`;

    const result = (await axios({
      url: tibberUrl,
      method: 'POST',
      headers: {
        Authorization: token
      },
      data: {
        query: query
      }
    })) as AxiosResponse<TibberRoot>;

    if (result.data.errors?.some((e) => e.message.includes('No valid access token in request'))) return false;

    return true;
  };

  const getTibberConsumption = async (year: number, month: number): Promise<TibberRoot> => {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const cursor = getCursor(year, month + 1);

    // prettier-ignore
    const query = 
    `{
        viewer {
          home(id: "${homeId}") {
            timeZone      
            consumption(resolution: DAILY, last: ${daysInMonth}, before: "${cursor}") {
              pageInfo {
                startCursor
                endCursor
              }
              nodes {
                from
                to
                cost
                unitPrice
                unitPriceVAT
                consumption
                consumptionUnit
              }
            }
          }
        }
      }`;

    const result = (await axios({
      url: tibberUrl,
      method: 'POST',
      headers: {
        Authorization: tibberToken
      },
      data: {
        query: query
      }
    })) as AxiosResponse<TibberRoot>;

    return result.data;
  };

  return { getHomes, getTibberConsumption, canLogin };
};
