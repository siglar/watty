import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

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
  const [shellyToken, setShellyToken] = useState<string>("");
  const [tibberToken, setTibberToken] = useState<string>("");
  const [homeId, setHomeId] = useState<string>("");

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
