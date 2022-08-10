import { FC, useState } from "react";
import { TextInput, Button, Group, Notification } from "@mantine/core";
import "./ShellyLogin.css";
import { useForm } from "@mantine/form";
import { useShellyEndpoint } from "../../api/shelly.service";
import { useAuthContext } from "../../context/auth.context";
import { IconX } from "@tabler/icons";

const ShellyLogin: FC = () => {
  const { logIn } = useShellyEndpoint();
  const { setLoggedIntoShelly, setTibberToken } = useAuthContext();

  const [logInError, setLoginError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      token: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const formSubmit = async (email: string, password: string, token: string) => {
    setLoading(true);
    setTibberToken("Bearer " + token);
    const loggedIn = await logIn(email, password);
    if (loggedIn) setLoggedIntoShelly(true);
    else {
      setLoginError(true);
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form
        onSubmit={form.onSubmit((values) =>
          formSubmit(values.email, values.password, values.token)
        )}
      >
        <TextInput
          autoComplete="email"
          type="email"
          required
          label="Shelly email"
          placeholder="Email used to log into Shelly app"
          {...form.getInputProps("email")}
        />

        <TextInput
          autoComplete="current-password"
          type="password"
          required
          label="Shelly password"
          placeholder="Password used to log into Shelly app"
          {...form.getInputProps("password")}
        />

        <TextInput
          autoComplete="on"
          type="password"
          required
          label="Tibber token"
          placeholder="Token retrieved from Tibber"
          {...form.getInputProps("token")}
        />

        {logInError && (
          <Notification
            className="notification-margin"
            icon={<IconX size={18} />}
            color="red"
            disallowClose
          >
            Username or password is incorrect.
          </Notification>
        )}

        <Group position="right" mt="md">
          <Button loading={loading} type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default ShellyLogin;
