import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import { useAuthContext } from "../context/auth.context";
import { Direction } from "../enums/direction.enum";
import { getDays } from "../helpers/tibber.helper";
import { TibberRoot } from "../models/tibber.models";

const tibberUrl = "https://api.tibber.com/v1-beta/gql";

export interface UseTibberEndpoint {
  getTibberConsumption: (
    month: number,
    direction: Direction
  ) => Promise<TibberRoot>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken, homeId } = useAuthContext();
  const currentCursor = useRef<string | null>(null);

  const getTibberConsumption = async (
    month: number,
    direction: Direction
  ): Promise<TibberRoot> => {
    const today = new Date();
    const currentMonth = today.getMonth();

    let days = -1;
    if (month === currentMonth) {
      days = Number.parseInt(String(today.getDate()).padStart(2, "0"));
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

    currentCursor.current =
      result.data.data.viewer.home.consumption.pageInfo.startCursor;

    return result.data;
  };

  return { getTibberConsumption };
};
