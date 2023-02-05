import { LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { useShellyEndpoint } from '../api/shelly.service';
import { useTibberEndpoint } from '../api/tibber.service';
import { ShellyDevice } from '../models/Shelly/device.models';
import { Home } from '../models/tibber.models';
import { useAuthContext } from './auth.context';

type ProviderProps = {
  children: ReactNode;
};

type DevicesContextType = {
  devices: ShellyDevice[];
  home: Home;
  device: ShellyDevice;
};

const DevicesContext = createContext<DevicesContextType>({
  devices: [],
  home: {} as Home,
  device: {} as ShellyDevice
});

export const useDevicesContext = (): DevicesContextType => useContext(DevicesContext);

export const DevicesContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const { tokens } = useAuthContext();
  const { getDevices } = useShellyEndpoint();
  const { getHomes } = useTibberEndpoint();

  const { data: devices, isLoading: devicesLoading } = useQuery(
    ['SHELLY', 'DEVICES', tokens.shellyToken],
    async () => {
      let result = await getDevices(tokens.shellyToken);
      return result.sort((a, b) => a.label.localeCompare(b.label));
    },
    { enabled: Boolean(tokens.shellyToken), onSuccess: (devices) => setDevice(devices[0]) }
  );

  const { data: userHomes, isLoading: homesLoading } = useQuery(
    ['TIBBER', 'HOMES', tokens.tibberToken],
    async () => {
      return (await getHomes(tokens.tibberToken)).sort();
    },
    { enabled: Boolean(tokens.tibberToken), onSuccess: (userHomes) => setHome(userHomes[1]) }
  );

  const [home, setHome] = useState<Home>({} as Home);
  const [device, setDevice] = useState<ShellyDevice>({} as ShellyDevice);

  const isLoading = devicesLoading || !devices || homesLoading || !userHomes || !home || !device;

  if (isLoading) return <LoadingOverlay visible={isLoading} overlayBlur={1} />;

  return <DevicesContext.Provider value={{ devices, home, device }}>{props.children}</DevicesContext.Provider>;
};
