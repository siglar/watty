import { Button, Loader, LoadingOverlay } from "@mantine/core";
import { IconArrowBack, IconRefresh } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useShellyEndpoint } from "../../api/shelly.service";
import { useTibberEndpoint } from "../../api/tibber.service";
import { useAuthContext } from "../../context/auth.context";
import "./ConsumptionView.css";

const ConsumptionView: FC = () => {
  const { getConsumption } = useShellyEndpoint();
  const { getAveragePrice } = useTibberEndpoint();
  const { setLoggedIntoShelly } = useAuthContext();

  const [consumedKw, setConsumedKw] = useState(0);
  const [priceForDevice, setPriceForDevice] = useState(0);

  const {
    data: shellyConsumption,
    refetch: refetchShelly,
    isRefetching: shellyFetching,
  } = useQuery(["SHELLY, CONSUMPTION"], async () => await getConsumption());

  var today = new Date();
  var days = Number.parseInt(String(today.getDate()).padStart(2, "0"));

  const {
    data: averagePrice,
    refetch: refetchTibber,
    isRefetching: tibberFetching,
  } = useQuery(
    ["TIBBER, CONSUMPTION"],
    async () => await getAveragePrice(days)
  );

  useEffect(() => {
    if (shellyConsumption !== undefined) {
      setConsumedKw(shellyConsumption.data.total ?? 0);
    }
  }, [shellyConsumption]);

  useEffect(() => {
    if (averagePrice !== undefined && shellyConsumption !== undefined) {
      setPriceForDevice(shellyConsumption.data.total * averagePrice);
    }
  }, [averagePrice]);

  const refetch = () => {
    refetchShelly();
    refetchTibber();
  };

  if (!shellyConsumption || !averagePrice) return <Loader />;

  return (
    <>
      <div className="button-row">
        <LoadingOverlay
          visible={shellyFetching || tibberFetching}
          overlayBlur={1}
        />
        <Button
          onClick={() => setLoggedIntoShelly(false)}
          leftIcon={<IconArrowBack />}
          variant="subtle"
        >
          Back to login
        </Button>
        <Button
          onClick={() => refetch()}
          leftIcon={<IconRefresh />}
          variant="subtle"
        >
          Refresh
        </Button>
      </div>

      <article>
        <p>Consumed kilowatts: {consumedKw} kW</p>
        <p>Kilowatt price: {averagePrice.toFixed(2)} kr</p>
        <p>Price for device {priceForDevice.toFixed(2)} kr</p>
      </article>
    </>
  );
};

export default ConsumptionView;
