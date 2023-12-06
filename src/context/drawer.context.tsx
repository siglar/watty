import { ActionIcon, Burger, Button, Drawer, LoadingOverlay, NavLink, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconActivity, IconArrowBack, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShellyEndpoint } from '../api/shelly.service';
import { useAuthContext } from './auth.context';
import { Tokens } from '../models/tokens.models';

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
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { tokens, setTokens } = useAuthContext();
  const { getDevices } = useShellyEndpoint();

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ['SHELLY', 'DEVICES', tokens.shellyToken],
    queryFn: async () => {
      let result = await getDevices(tokens.shellyToken);
      return result.sort((a, b) => a.label.localeCompare(b.label));
    },
    enabled: Boolean(tokens.shellyToken)
  });

  const isLoading = devicesLoading || !devices;
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const dark = colorScheme === 'dark';

  useEffect(() => {
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  const changeDevice = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
    setOpened(false);
  };

  const backToLogin = () => {
    setTokens({} as Tokens);
    navigate('/');
  };

  if (isLoading) return <LoadingOverlay visible={isLoading} overlayProps={{ blur: 1 }} />;

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
          alignItems: 'center',
          width: '100%',
          marginBottom: '1rem',
          padding: '0 1rem 0 1rem',
          gap: '12px',
          borderStyle: 'solid',
          borderWidth: '0 0 1px 0',
          borderColor: '#666666'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Burger color="#228be6" opened={opened} onClick={() => setOpened(!opened)} title={'Select device'}></Burger>
            <h4 style={{ cursor: 'pointer' }} onClick={() => setOpened(!opened)}>
              {devices.find((d) => d.value === deviceId)?.label}
            </h4>
          </div>
          <div style={{ display: 'flex' }}>
            <ActionIcon
              variant="outline"
              color={dark ? 'orange' : 'blue'}
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </div>
        </div>
      </div>

      <Drawer opened={opened} onClose={() => setOpened(false)} size="xl" withCloseButton={false}>
        <div style={{ paddingBottom: '1rem', paddingTop: '1rem' }}>
          <Button onClick={backToLogin} leftSection={<IconArrowBack />} variant="subtle">
            Back to login
          </Button>
        </div>

        {devices.map((device, index) => {
          return (
            <NavLink
              key={index}
              label={device.label}
              leftSection={<IconActivity size={16} stroke={1.5} />}
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
