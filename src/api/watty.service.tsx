import axios from 'axios';

const wattyApiUrl = 'https://localhost:7040';

export interface UseWattyEndpoint {
  addUser: (email: string, name: string, password: string, shellyToken: string, tibberToken: string) => Promise<boolean>;
  authorize: (email: string, password: string) => Promise<string>;
}

export const useWattyEndpoint = (): UseWattyEndpoint => {
  /**
   * Add new user
   * @param email
   * @param name
   * @param password
   * @param shellyToken
   * @param tibberToken
   * @returns True if user added
   */
  const addUser = async (email: string, name: string, password: string, shellyToken: string, tibberToken: string) => {
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

  /**
   * Authorize user
   * @param email
   * @param password
   * @returns Bearer token if authorized
   */
  const authorize = async (email: string, password: string) => {
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
