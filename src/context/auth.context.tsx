import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { HomeId } from '../models/tibber.models';

type ProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  shellyToken: string;
  setShellyToken: Dispatch<SetStateAction<string>>;
  tibberToken: string;
  setTibberToken: Dispatch<SetStateAction<string>>;
  homeId: string;
  setHomeId: Dispatch<SetStateAction<string>>;
  device: string;
  setDeviceId: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType>({
  shellyToken: '',
  setShellyToken: () => console.log('no provider'),
  tibberToken: '',
  setTibberToken: () => console.log('no provider'),
  homeId: '',
  setHomeId: () => console.log('no provider'),
  device: '',
  setDeviceId: () => console.log('no provider')
});

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

export const AuthContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [shellyToken, setShellyToken] = useState<string>(localStorage.getItem('shellyToken') ?? '');
  const [tibberToken, setTibberToken] = useState<string>(localStorage.getItem('tibberToken') ?? '');

  const tibberHome = JSON.parse(localStorage.getItem('tibberHome') ?? '{}') as HomeId;

  const [homeId, setHomeId] = useState<string>(tibberHome?.id ?? '');

  const { deviceId } = useParams();
  const [device, setDeviceId] = useState<string>(deviceId ?? localStorage.getItem('device') ?? '');

  return (
    <AuthContext.Provider
      value={{
        shellyToken,
        setShellyToken,
        tibberToken,
        setTibberToken,
        homeId,
        setHomeId,
        device,
        setDeviceId
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
