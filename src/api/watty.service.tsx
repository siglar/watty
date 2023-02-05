import axios from 'axios';
import { Tokens } from '../models/tokens.models';

const wattyApiUrl = 'https://localhost:7040';

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
   * @returns Bearer token if authorized
   */
  authorize: (email: string, password: string) => Promise<Tokens>;
}

export const useWattyEndpoint = (): UseWattyEndpoint => {
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

  return { addUser, authorize };
};
