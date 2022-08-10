import axios, { AxiosResponse } from "axios";
import { useAuthContext } from "../context/auth.context";
import { calculateAveragePrice } from "../helpers/calculations.helper";
import { TibberRoot } from "../models/tibber.models";

const tibberUrl = "https://api.tibber.com/v1-beta/gql";

export interface UseTibberEndpoint {
  getAveragePrice: (days: number) => Promise<number>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken } = useAuthContext();

  const getAveragePrice = async (days: number): Promise<number> => {
    const result = (await axios({
      url: tibberUrl,
      method: "POST",
      headers: {
        Authorization: tibberToken,
      },
      data: {
        query: `
                {
                    viewer {
                      homes {
                        timeZone      
                        consumption(resolution: DAILY, last: ${days}) {
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
                  `,
      },
    })) as AxiosResponse<TibberRoot>;

    return calculateAveragePrice(result.data);
  };

  return { getAveragePrice };
};
