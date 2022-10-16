import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import { useAuthContext } from "../context/auth.context";
import { Direction } from "../enums/direction.enum";
import { getDays } from "../helpers/tibber.helper";
import { Home, TibberRoot, Node } from "../models/tibber.models";

const tibberUrl = "https://api.tibber.com/v1-beta/gql";

export interface UseTibberEndpoint {
  getHomes: (token: string) => Promise<Home[]>;
  canLogin: (token: string) => Promise<boolean>;
  getTibberConsumption: (
    month: number,
    direction: Direction
  ) => Promise<TibberRoot>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken, homeId } = useAuthContext();
  const currentCursor = useRef<string | null>(null);

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
      method: "POST",
      headers: {
        Authorization: token,
      },
      data: {
        query: query,
      },
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
      method: "POST",
      headers: {
        Authorization: token,
      },
      data: {
        query: query,
      },
    })) as AxiosResponse<TibberRoot>;

    if (
      result.data.errors?.some((e) =>
        e.message.includes("No valid access token in request")
      )
    )
      return false;

    return true;
  };

  const getTibberConsumption = async (
    month: number,
    direction: Direction
  ): Promise<TibberRoot> => {
    const today = new Date();
    const currentMonth = today.getMonth();

    let days = -1;
    if (month === currentMonth) {
      days = Number.parseInt(String(today.getDate()).padStart(2, "0")) - 1;
    } else {
      days = getDays(today.getFullYear(), month);
    }

    const resolution = `DAILY, last: ${days}`;

    // prettier-ignore
    const query = 
    `{
        viewer {
          home(id: \"${homeId}\") {
            timeZone      
            consumption(resolution: ${resolution}${currentCursor.current ? `, ${direction}: \"${currentCursor.current}\"` : ""}) {
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
      method: "POST",
      headers: {
        Authorization: tibberToken,
      },
      data: {
        query: query,
      },
    })) as AxiosResponse<TibberRoot>;

    if (result.data.data.viewer.home.consumption) {
      currentCursor.current =
        result.data.data.viewer.home.consumption.pageInfo.startCursor;
    }

    if (month === currentMonth) {
      const consumptionToday = await getTibberConsumptionToday(
        result.data.data.viewer.home.consumption.pageInfo.endCursor
      );

      result.data.data.viewer.home.consumption.nodes.push(consumptionToday);
    }

    return result.data;
  };

  const getTibberConsumptionToday = async (
    endCursor: string
  ): Promise<Node> => {
    // prettier-ignore
    const query = 
    `{
        viewer {
          home(id: \"${homeId}\") {
            timeZone      
            consumption(resolution: DAILY, after:\"${endCursor}\", first: 1) {
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
      method: "POST",
      headers: {
        Authorization: tibberToken,
      },
      data: {
        query: query,
      },
    })) as AxiosResponse<TibberRoot>;

    return result.data.data.viewer.home.consumption.nodes[0];
  };

  return { getHomes, getTibberConsumption, canLogin };
};
