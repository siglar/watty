import { TextInput, Text, Group, Button, PasswordInput, Popover, Progress, Notification, LoadingOverlay } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWattyEndpoint } from '../../../api/watty.service';
import LoginHeader from '../LogInHeader/LoginHeader';
import PasswordRequirement from '../PasswordRequirement/PasswordRequirement';
import { showNotification } from '@mantine/notifications';

const Register: FC = () => {
  const { addUser } = useWattyEndpoint();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      shellyToken: ''
    },

    validate: {
      email: isEmail('Invalid email')
    }
  });

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
  ];

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));

  const getStrength = (password: string) => {
    let multiplier = password.length > 7 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  };

  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const register = async (email: string, name: string, password: string, shellyToken: string) => {
    try {
      setIsLoading(true);
      const success = await addUser(email, name, password, shellyToken);

      if (success) {
        navigate('/');
        showNotification({
          icon: <IconCheck size={18} />,
          color: 'teal',
          title: 'Account created',
          message: 'Well done, you can now log in 🎉'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={1} />
      <LoginHeader>
        <Group position="left" mt="md">
          <Link to="/">
            <Button leftIcon={<IconArrowBack />} variant="subtle">
              Back to login
            </Button>
          </Link>
        </Group>

        <Notification disallowClose>
          <Text>
            By registering you get access to the <i>power save mode</i>.
          </Text>
          <Text>
            <i>Power save mode</i> will automatically switch off selected devices when the price is at its highest.
          </Text>
          <Text>To do this, Watty needs to save your Shelly token. Don't worry though, it's encrypted and kept safe.</Text>
        </Notification>

        <form onSubmit={form.onSubmit((values) => register(values.email, values.name, password, values.shellyToken))}>
          <TextInput type="email" withAsterisk label="Email" placeholder="Your email" {...form.getInputProps('email')} />
          <Popover opened={popoverOpened} position="bottom" width="target" transition="pop">
            <Popover.Target>
              <div onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)}>
                <PasswordInput
                  withAsterisk
                  label="Your password"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </div>
            </Popover.Target>

            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
              <PasswordRequirement label="Includes at least 8 characters" meets={password.length > 7} />
              {checks}
            </Popover.Dropdown>
          </Popover>

          <TextInput type="text" withAsterisk label="Name" placeholder="Your name" {...form.getInputProps('name')} />

          <TextInput
            type="password"
            withAsterisk
            label="Shelly token"
            placeholder="Your Shelly token"
            {...form.getInputProps('shellyToken')}
          />

          <Group position="right" mt="md">
            <Button type="submit">Register account</Button>
          </Group>
        </form>
      </LoginHeader>
    </>
  );
};

export default Register;
