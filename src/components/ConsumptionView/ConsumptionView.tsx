import { Button } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useShellyEndpoint } from "../../api/shelly.service";
import { useTibberEndpoint } from "../../api/tibber.service";
import { useAuthContext } from "../../context/auth.context";
import "./ConsumptionView.css";

const ConsumptionView: FC = () => {
  const { getConsumption } = useShellyEndpoint();
  const { getAveragePrice } = useTibberEndpoint();
  const { setLoggedIntoShelly } = useAuthContext();

  const { data: shellyConsumption } = useQuery(
    ["SHELLY_CONSUMPTION"],
    async () => await getConsumption()
  );

  var today = new Date();
  var days = Number.parseInt(String(today.getDate()).padStart(2, "0"));

  const { data: averagePrice } = useQuery(
    ["TIBBER_CONSUMPTION"],
    async () => await getAveragePrice(days)
  );

  const consumedKw = shellyConsumption?.data.total ?? 0;

  if (!averagePrice) return null;

  const priceForDevice = consumedKw * averagePrice;

  return (
    <>
      <Button
        onClick={() => setLoggedIntoShelly(false)}
        leftIcon={<IconArrowBack />}
        variant="subtle"
      >
        Back to login
      </Button>
      <p>Consumed kilowatts: {consumedKw} kW</p>
      <p>Kilowatt price: {averagePrice.toFixed(2)} kr</p>
      <p>Price for device {priceForDevice.toFixed(2)} kr</p>
    </>
  );
};

export default ConsumptionView;
