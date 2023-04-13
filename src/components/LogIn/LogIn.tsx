import { TextInput, Group, Button, LoadingOverlay } from '@mantine/core';
import { useForm, isNotEmpty, isEmail } from '@mantine/form';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWattyEndpoint } from '../../api/watty.service';
import { useAuthContext } from '../../context/auth.context';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useShellyEndpoint } from '../../api/shelly.service';

const LogIn: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setTokens, tokens } = useAuthContext();
  const { authorize } = useWattyEndpoint();
  const { getDevices } = useShellyEndpoint();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('A password is required')
    }
  });

  useQuery(
    ['SHELLY', 'DEVICES', tokens.shellyToken],
    async () => {
      const result = await getDevices(tokens.shellyToken);
      return result.sort((a, b) => a.label.localeCompare(b.label));
    },
    { enabled: Boolean(tokens.shellyToken) && isLoggedIn, onSuccess: (devices) => navigate(`/devices/${devices[0].value}`) }
  );

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const tokens = await authorize(email, password);
      setTokens(tokens);
      localStorage.setItem('tokens', JSON.stringify(tokens));
      setIsLoggedIn(true);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        showNotification({
          icon: <IconX size={18} />,
          color: 'red',
          title: 'Incorrect credentials',
          message: 'Hmm, those credentials are off. Try again? 🤔'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={1} />

      <form onSubmit={form.onSubmit((values) => login(values.email, values.password))}>
        <TextInput type="email" withAsterisk label="Email" placeholder="Your email" {...form.getInputProps('email')} />
        <TextInput type="password" withAsterisk label="Password" placeholder="Your password" {...form.getInputProps('password')} />

        <Group position="right" mt="md">
          <Link to="/register">
            <Button type="button" variant="subtle">
              Don't have an account? Register here
            </Button>
          </Link>
          <Button type="submit">Log in</Button>
        </Group>
      </form>
    </>
  );
};

export default LogIn;
