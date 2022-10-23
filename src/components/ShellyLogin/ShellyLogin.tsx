import { FC, useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Notification,
  Checkbox,
  Select,
  Loader,
} from "@mantine/core";
import "./ShellyLogin.css";
import { useForm } from "@mantine/form";
import { useAuthContext } from "../../context/auth.context";
import { IconX } from "@tabler/icons";
import logo from "../../assets/logo.jpg";
import { useTibberEndpoint } from "../../api/tibber.service";
import { useShellyEndpoint } from "../../api/shelly.service";
import { useQuery } from "@tanstack/react-query";
import { HomeId } from "../../models/tibber.models";

const ShellyLogin: FC = () => {
  const { canLogin: canLoginShelly, getDevices } = useShellyEndpoint();
  const { canLogin: canLoginTibber, getHomes } = useTibberEndpoint();
  const {
    setLoggedIntoShelly,
    setTibberToken,
    tibberToken,
    setShellyToken,
    shellyToken,
    setHomeId,
    homeId,
    device,
    setDeviceId,
  } = useAuthContext();

  const [shellyLogInError, setShellyLogInError] = useState<boolean>(false);
  const [tibberLogInError, setTibberLogInError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const tibberHome = JSON.parse(
    localStorage.getItem("tibberHome") ?? "{}"
  ) as HomeId;

  const [selectedHome] = useState<string>(tibberHome?.address ?? "");
  const [selectedDevice] = useState<string>(device);

  const { data: userHomes, isLoading: homesLoading } = useQuery(
    ["TIBBER", "HOMES", tibberToken],
    async () => {
      if (tibberToken.length > 0) {
        return (await getHomes(tibberToken)).sort();
      }
      return [];
    }
  );

  const { data: devices, isLoading: devicesLoading } = useQuery(
    ["SHELLY", "DEVICES", shellyToken],
    async () => {
      if (shellyToken.length > 0) {
        return await getDevices(shellyToken);
      }
      return [];
    }
  );

  const currentHomes = userHomes?.map((h) => h.address.address1).sort();

  const loginShelly = async (key: string) => {
    if (key.length === 92 && (await canLoginShelly(key))) {
      setShellyToken(key);
      setShellyLogInError(false);
    } else if (key.length !== 0) {
      setShellyLogInError(true);
    }
  };

  const loginTibber = async (token: string) => {
    if (token.length === 43 && (await canLoginTibber("Bearer " + token))) {
      setTibberToken(token);
      setTibberLogInError(false);
    } else if (token.length !== 0) {
      setTibberLogInError(true);
    }
  };

  const getHomeId = (address: string) => {
    const homeId = userHomes?.find((u) => u.address.address1 === address)?.id;
    if (homeId) return homeId;
    return "";
  };

  const form = useForm({
    initialValues: {
      shellyToken: localStorage.getItem("shellyToken") ?? "",
      device: localStorage.getItem("device") ?? "",
      tibberToken: localStorage.getItem("tibberToken") ?? "",
      home: tibberHome?.address ?? "",
      rememberShellyToken: false,
      rememberDevice: false,
      rememberTibberToken: false,
      rememberHome: false,
    },
  });

  const formSubmit = async (
    shellyToken: string,
    device: string,
    tibberToken: string,
    home: string,
    rememberShellyToken: boolean,
    rememberDevice: boolean,
    rememberTibberToken: boolean,
    rememberHome: boolean
  ) => {
    setLoading(true);

    if (rememberShellyToken) localStorage.setItem("shellyToken", shellyToken);
    if (rememberDevice) localStorage.setItem("device", device);
    if (rememberTibberToken) localStorage.setItem("tibberToken", tibberToken);
    if (rememberHome)
      localStorage.setItem(
        "tibberHome",
        JSON.stringify({ id: getHomeId(home), address: home })
      );

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
            values.device,
            values.tibberToken,
            values.home,
            values.rememberShellyToken,
            values.rememberDevice,
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
          type="password"
          required
          placeholder="Shelly token"
          onBlur={(e) => loginShelly(e.currentTarget.value)}
          {...form.getInputProps("shellyToken")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember"
            {...form.getInputProps("rememberShellyToken")}
          />
        </div>

        <Select
          value={selectedDevice}
          className="text-input"
          size="md"
          label="Shelly devices"
          placeholder={
            tibberToken.length <= 0 ? "Enter valid Shelly key" : "Pick a device"
          }
          required
          disabled={devicesLoading || (devices && devices.length <= 0)}
          data={devices ?? []}
          onSelect={(e) => setDeviceId(e.currentTarget.value)}
          rightSection={devicesLoading && <Loader size="xs" />}
          {...form.getInputProps("device")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember"
            {...form.getInputProps("rememberDevice")}
          />
        </div>

        <TextInput
          size="md"
          label="Tibber token"
          aria-label="Tibber token"
          className="text-input"
          type="password"
          onBlur={(e) => loginTibber(e.currentTarget.value)}
          required
          placeholder="Tibber token"
          rightSection={homesLoading && <Loader size="xs" />}
          {...form.getInputProps("tibberToken")}
        />

        <div className="tibber-checkbox">
          <Checkbox
            label="Remember"
            {...form.getInputProps("rememberTibberToken")}
          />
        </div>

        <Select
          value={selectedHome}
          className="text-input"
          size="md"
          label="Tibber homes"
          placeholder={
            tibberToken.length <= 0 ? "Enter valid Tibber token" : "Pick a home"
          }
          required
          disabled={homesLoading || (userHomes && userHomes.length <= 0)}
          data={currentHomes ?? []}
          onSelect={(e) => setHomeId(getHomeId(e.currentTarget.value))}
          rightSection={homesLoading && <Loader size="xs" />}
          {...form.getInputProps("home")}
        />

        <div className="tibber-checkbox">
          <Checkbox label="Remember" {...form.getInputProps("rememberHome")} />
        </div>

        {shellyLogInError && (
          <Notification
            className="notification-margin"
            icon={<IconX size={18} />}
            color="red"
            disallowClose
          >
            Shelly login is invalid.
          </Notification>
        )}

        {tibberLogInError && (
          <Notification
            className="notification-margin"
            icon={<IconX size={18} />}
            color="red"
            disallowClose
          >
            Tibber token is invalid.
          </Notification>
        )}

        <Group position="right" mt="md">
          <Button
            disabled={
              shellyLogInError ||
              tibberLogInError ||
              homesLoading ||
              homeId.length <= 0
            }
            variant="default"
            loading={loading}
            type="submit"
          >
            Log in
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default ShellyLogin;
