import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { HomeId } from "../models/tibber.models";

type ProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  loggedIntoShelly: boolean;
  setLoggedIntoShelly: Dispatch<SetStateAction<boolean>>;
  shellyToken: string;
  setShellyToken: Dispatch<SetStateAction<string>>;
  tibberToken: string;
  setTibberToken: Dispatch<SetStateAction<string>>;
  homeId: string;
  setHomeId: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType>({
  loggedIntoShelly: false,
  setLoggedIntoShelly: () => console.log("no provider"),
  shellyToken: "",
  setShellyToken: () => console.log("no provider"),
  tibberToken: "",
  setTibberToken: () => console.log("no provider"),
  homeId: "",
  setHomeId: () => console.log("no provider"),
});

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

export const AuthContextProvider: FC<ProviderProps> = (
  props: ProviderProps
) => {
  const [loggedIntoShelly, setLoggedIntoShelly] = useState<boolean>(false);
  const [shellyToken, setShellyToken] = useState<string>(
    localStorage.getItem("shellyToken") ?? ""
  );
  const [tibberToken, setTibberToken] = useState<string>(
    localStorage.getItem("tibberToken") ?? ""
  );

  const tibberHome = JSON.parse(
    localStorage.getItem("tibberHome") ?? "{}"
  ) as HomeId;

  const [homeId, setHomeId] = useState<string>(tibberHome?.id ?? "");

  return (
    <AuthContext.Provider
      value={{
        loggedIntoShelly,
        setLoggedIntoShelly,
        shellyToken,
        setShellyToken,
        tibberToken,
        setTibberToken,
        homeId,
        setHomeId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
