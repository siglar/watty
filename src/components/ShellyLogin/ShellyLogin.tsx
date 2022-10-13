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
import { useAuthContext } from "../../context/auth.context";
import { IconX } from "@tabler/icons";
import logo from "../../assets/logo.jpg";
import { useTibberEndpoint } from "../../api/tibber.service";
import { useShellyEndpoint } from "../../api/shelly.service";

const ShellyLogin: FC = () => {
  const { canLogin: canLoginShelly } = useShellyEndpoint();
  const { canLogin: canLoginTibber } = useTibberEndpoint();
  const { setLoggedIntoShelly, setTibberToken, setShellyToken, setHomeId } =
    useAuthContext();

  const [shellyLogInError, setShellyLogInError] = useState<boolean>(false);
  const [tibberLogInError, setTibberLogInError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      shellyToken: localStorage.getItem("shellyToken") ?? "",
      tibberToken: localStorage.getItem("tibberToken") ?? "",
      home: localStorage.getItem("tibberHome") ?? "",
      rememberShellyToken: false,
      rememberTibberToken: false,
      rememberHome: false,
    },
  });

  const formSubmit = async (
    shellyToken: string,
    tibberToken: string,
    home: string,
    rememberShellyToken: boolean,
    rememberTibberToken: boolean,
    rememberHome: boolean
  ) => {
    setLoading(true);

    const [shellyLogin, tibberLogin] = await Promise.all([
      canLoginShelly(shellyToken),
      canLoginTibber("Bearer " + tibberToken),
    ]);

    if (!shellyLogin) {
      setShellyLogInError(true);
    }

    if (!tibberLogin) {
      setTibberLogInError(true);
    }

    if (!tibberLogin || !shellyLogin) {
      setLoading(false);
      return;
    }

    setShellyToken(shellyToken);
    setTibberToken("Bearer " + tibberToken);
    setHomeId(home);

    if (rememberShellyToken) localStorage.setItem("shellyToken", shellyToken);
    if (rememberTibberToken) localStorage.setItem("tibberToken", tibberToken);
    if (rememberHome) localStorage.setItem("tibberHome", home);

    setLoggedIntoShelly(true);
  };

  return (
    <div className="login-wrapper">
      <div className="login-header">
        <img src={logo} alt="Watty logo" />
        <article>
          <p>Welcome to Watty</p>
          <p>Please log in.</p>
        </article>
      </div>

      <form
        onSubmit={form.onSubmit((values) =>
          formSubmit(
            values.shellyToken,
            values.tibberToken,
            values.home,
            values.rememberShellyToken,
            values.rememberTibberToken,
            values.rememberHome
          )
        )}
      >
        <TextInput
          size="md"
          label="Shelly token"
          aria-label="Shelly token"
          className="text-input"
          autoComplete="on"
          type="password"
          required
          placeholder="Shelly token"
          {...form.getInputProps("shellyToken")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember Shelly token"
            {...form.getInputProps("rememberShellyToken")}
          />
        </div>

        <TextInput
          size="md"
          label="Tibber token"
          aria-label="Tibber token"
          className="text-input"
          autoComplete="on"
          type="password"
          required
          placeholder="Tibber token"
          {...form.getInputProps("tibberToken")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember Tibber token"
            {...form.getInputProps("rememberTibberToken")}
          />
        </div>

        <TextInput
          size="md"
          label="Tibber home ID"
          aria-label="Tibber home ID"
          className="text-input"
          autoComplete="on"
          type="text"
          required
          placeholder="Tibber home ID"
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
          <Button variant="default" loading={loading} type="submit">
            Log in
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default ShellyLogin;
