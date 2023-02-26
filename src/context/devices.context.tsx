import { LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { useShellyEndpoint } from '../api/shelly.service';
import { ShellyDevice } from '../models/Shelly/device.models';
import { useAuthContext } from './auth.context';

type ProviderProps = {
  children: ReactNode;
};

type DevicesContextType = {
  devices: ShellyDevice[];
  device: ShellyDevice;
};

const DevicesContext = createContext<DevicesContextType>({
  devices: [],
  device: {} as ShellyDevice
});

export const useDevicesContext = (): DevicesContextType => useContext(DevicesContext);

export const DevicesContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const { tokens } = useAuthContext();
  const { getDevices } = useShellyEndpoint();

  const { data: devices, isLoading: devicesLoading } = useQuery(
    ['SHELLY', 'DEVICES', tokens.shellyToken],
    async () => {
      const result = await getDevices(tokens.shellyToken);
      return result.sort((a, b) => a.label.localeCompare(b.label));
    },
    { enabled: Boolean(tokens.shellyToken), onSuccess: (devices) => setDevice(devices[0]) }
  );

  const [device, setDevice] = useState<ShellyDevice>({} as ShellyDevice);

  const isLoading = devicesLoading || !devices || !device;

  if (isLoading) return <LoadingOverlay visible={isLoading} overlayBlur={1} />;

  return <DevicesContext.Provider value={{ devices, device }}>{props.children}</DevicesContext.Provider>;
};
