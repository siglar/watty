import { TextInput, Checkbox, Group, Button, PasswordInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWattyEndpoint } from '../../api/watty.service';
import { useAuthContext } from '../../context/auth.context';
import './LogIn.css';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';

const LogIn: FC = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length >= 8
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const { setWattyToken } = useAuthContext();

  const { authorize } = useWattyEndpoint();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const token = await authorize(email, password);
      setWattyToken(`Bearer ${token}`);
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
      <Group position="right" mt="md">
        <Checkbox mt="md" label="Skip login" />
      </Group>

      <form onSubmit={form.onSubmit((values) => login(values.email, values.password))}>
        <TextInput type="email" withAsterisk label="Email" placeholder="Your email" {...form.getInputProps('email')} />
        <TextInput type="password" withAsterisk label="Password" placeholder="Your password" {...form.getInputProps('password')} />
        {/* <PasswordInput type="password" withAsterisk label="Your password" placeholder="Your password" {...form.getInputProps('password')} /> */}

        <Group position="right" mt="md">
          <Link to="/register">
            <Button type="button" variant="subtle">
              Don't have an account? Register here
            </Button>
          </Link>
          <Button type="submit" disabled={!form.isValid()}>
            Log in
          </Button>
        </Group>
      </form>
    </>
  );
};

export default LogIn;
