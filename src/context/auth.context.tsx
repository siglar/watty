import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { Tokens } from '../models/tokens.models';

type ProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  tokens: Tokens;
  setTokens: Dispatch<SetStateAction<Tokens>>;
};

export const AuthContext = createContext<AuthContextType>({
  tokens: {} as Tokens,
  setTokens: () => console.log('no provider')
});

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

export const AuthContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [tokens, setTokens] = useState<Tokens>(JSON.parse(localStorage.getItem('tokens') ?? '{}') as Tokens);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
