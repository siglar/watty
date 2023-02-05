import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { HomeId } from '../models/tibber.models';
import { Tokens } from '../models/tokens.models';

type ProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  tokens: Tokens;
  setTokens: Dispatch<SetStateAction<Tokens>>;
  homeId: string;
  setHomeId: Dispatch<SetStateAction<string>>;
  device: string;
  setDeviceId: Dispatch<SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType>({
  tokens: {} as Tokens,
  setTokens: () => console.log('no provider'),
  homeId: '',
  setHomeId: () => console.log('no provider'),
  device: '',
  setDeviceId: () => console.log('no provider')
});

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

export const AuthContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [tokens, setTokens] = useState<Tokens>(JSON.parse(localStorage.getItem('tokens') ?? '{}') as Tokens);

  const tibberHome = JSON.parse(localStorage.getItem('tibberHome') ?? '{}') as HomeId;

  const [homeId, setHomeId] = useState<string>(tibberHome?.id ?? '');

  const { deviceId } = useParams();
  const [device, setDeviceId] = useState<string>(deviceId ?? localStorage.getItem('device') ?? '');

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
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
