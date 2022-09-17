import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import { useAuthContext } from "../context/auth.context";
import { Direction } from "../enums/direction.enum";
import { calculateAveragePrice, getDays } from "../helpers/tibber.helper";
import { TibberRoot } from "../models/tibber.models";

const tibberUrl = "https://api.tibber.com/v1-beta/gql";

export interface UseTibberEndpoint {
  getAveragePrice: (month: number, direction: Direction) => Promise<number>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken, homeId } = useAuthContext();
  const currentCursor = useRef<string | null>(null);

  const getAveragePrice = async (
    month: number,
    direction: Direction
  ): Promise<number> => {
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
    const query = `
    {
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
      }
      `;

    console.log(query);

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

    return calculateAveragePrice(result.data);
  };

  return { getAveragePrice };
};
