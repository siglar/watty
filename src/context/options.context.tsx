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

export type OptionsContextType = {
  withElectricitySupport: boolean;
  setWithElectricitySupport: Dispatch<SetStateAction<boolean>>;
};

export const OptionsContext = createContext<OptionsContextType>({
  withElectricitySupport: false,
  setWithElectricitySupport: () => console.log("no provider"),
});

export const useOptionsContext = (): OptionsContextType =>
  useContext(OptionsContext);

export const OptionsContextProvider: FC<ProviderProps> = (
  props: ProviderProps
) => {
  const [withElectricitySupport, setWithElectricitySupport] = useState(false);

  return (
    <OptionsContext.Provider
      value={{
        withElectricitySupport,
        setWithElectricitySupport,
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  );
};
