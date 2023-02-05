import { Burger, Drawer, NavLink } from '@mantine/core';
import { IconActivity, IconChevronRight } from '@tabler/icons';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDevicesContext } from './devices.context';

type ProviderProps = {
  children: ReactNode;
};

export type DrawerContextType = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

export const DrawerContext = createContext<DrawerContextType>({
  opened: false,
  setOpened: () => console.log('no provider')
});

export const useDrawerContext = (): DrawerContextType => useContext(DrawerContext);

export const DrawerContextProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [opened, setOpened] = useState(false);
  const { devices } = useDevicesContext();
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const changeDevice = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
    setOpened(false);
  };

  return (
    <DrawerContext.Provider
      value={{
        opened,
        setOpened
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '1rem',
          padding: '0 1rem 0 1rem'
        }}
      >
        <h4>{devices.find((d) => d.value === deviceId)?.label}</h4>
        <Burger opened={opened} onClick={() => setOpened(!opened)} title={'Select device'} />
      </div>

      <Drawer opened={opened} onClose={() => setOpened(false)} size="xl">
        {devices.map((device, index) => {
          return (
            <NavLink
              key={index}
              label={device.label}
              icon={<IconActivity size={16} stroke={1.5} />}
              rightSection={<IconChevronRight size={12} stroke={1.5} />}
              variant="filled"
              active={device.value === deviceId}
              onClick={() => changeDevice(devices.find((d) => d.value === device.value)?.value ?? '')}
            />
          );
        })}
      </Drawer>
      {props.children}
    </DrawerContext.Provider>
  );
};
