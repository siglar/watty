import { FC, useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Notification,
  Checkbox,
} from "@mantine/core";
import "./ShellyLogin.css";
import { useForm } from "@mantine/form";
import { useShellyEndpoint } from "../../api/shelly.service";
import { useAuthContext } from "../../context/auth.context";
import { IconX } from "@tabler/icons";
import logo from "../../assets/logo.jpg";
import { useTibberEndpoint } from "../../api/tibber.service";

const ShellyLogin: FC = () => {
  const { logIn } = useShellyEndpoint();
  const { canLogin } = useTibberEndpoint();
  const { setLoggedIntoShelly, setTibberToken, setHomeId } = useAuthContext();

  const [shellyLogInError, setShellyLogInError] = useState<boolean>(false);
  const [tibberLogInError, setTibberLogInError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      token: localStorage.getItem("tibberToken") ?? "",
      home: localStorage.getItem("tibberHome") ?? "",
      rememberToken: false,
      rememberHome: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const formSubmit = async (
    email: string,
    password: string,
    token: string,
    home: string,
    rememberToken: boolean,
    rememberHome: boolean
  ) => {
    setLoading(true);

    const tibberLogin = await canLogin("Bearer " + token);
    const shellyLogin = await logIn(email, password);

    if (!tibberLogin) {
      setTibberLogInError(true);
    }

    if (!shellyLogin) {
      setShellyLogInError(true);
    }

    if (!tibberLogin || !shellyLogin) {
      setLoading(false);
      return;
    }

    setTibberToken("Bearer " + token);
    setHomeId(home);

    if (rememberToken) localStorage.setItem("tibberToken", token);
    if (rememberHome) localStorage.setItem("tibberHome", home);
    setLoggedIntoShelly(true);
  };

  return (
    <div className="login-wrapper">
      <img src={logo} alt="Watty logo" />
      <form
        onSubmit={form.onSubmit((values) =>
          formSubmit(
            values.email,
            values.password,
            values.token,
            values.home,
            values.rememberToken,
            values.rememberHome
          )
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

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember token"
            {...form.getInputProps("rememberToken")}
          />
        </div>

        <TextInput
          autoComplete="on"
          type="text"
          required
          label="Tibber home"
          placeholder="Home ID retrieved from Tibber"
          {...form.getInputProps("home")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember home"
            {...form.getInputProps("rememberHome")}
          />
        </div>

        {shellyLogInError && (
          <Notification
            className="notification-margin"
            icon={<IconX size={18} />}
            color="red"
            disallowClose
          >
            Shelly login is incorrect.
          </Notification>
        )}

        {tibberLogInError && (
          <Notification
            className="notification-margin"
            icon={<IconX size={18} />}
            color="red"
            disallowClose
          >
            Tibber token is incorrect.
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
