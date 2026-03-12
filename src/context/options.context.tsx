import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export type OptionsContextType = {
  useNorgespris: boolean;
  setUseNorgespris: Dispatch<SetStateAction<boolean>>;
};

export const OptionsContext = createContext<OptionsContextType>({
  useNorgespris: false,
  setUseNorgespris: () => console.log('no provider')
});

export const useOptionsContext = (): OptionsContextType => useContext(OptionsContext);

export const OptionsContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [useNorgespris, setUseNorgespris] = useState(false);

  return (
    <OptionsContext.Provider
      value={{
        useNorgespris,
        setUseNorgespris
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  );
};
