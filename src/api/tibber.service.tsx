import axios, { AxiosResponse } from "axios";
import { useAuthContext } from "../context/auth.context";
import { calculateAveragePrice } from "../helpers/calculations.helper";
import { TibberRoot } from "../models/tibber.models";

const tibberUrl = "https://api.tibber.com/v1-beta/gql";

export interface UseTibberEndpoint {
  getAveragePrice: (month: number) => Promise<number>;
}

export const useTibberEndpoint = (): UseTibberEndpoint => {
  const { tibberToken } = useAuthContext();

  const getAveragePrice = async (month: number): Promise<number> => {
    const today = new Date();
    const currentMonth = today.getMonth();

    let resolution = "";

    if (month === currentMonth) {
      var days = Number.parseInt(String(today.getDate()).padStart(2, "0"));
      resolution = `DAILY, last: ${days}`;
    } else {
      resolution = `MONTHLY, last: ${1}`;
    }

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
                        consumption(resolution: ${resolution}) {
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
