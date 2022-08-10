import { FC } from "react";
import ConsumptionView from "../components/ConsumptionView/ConsumptionView";
import ShellyLogin from "../components/ShellyLogin/ShellyLogin";

import { useAuthContext } from "../context/auth.context";

const LandingPage: FC = () => {
  const { loggedIntoShelly } = useAuthContext();

  if (!loggedIntoShelly) return <ShellyLogin />;

  return <ConsumptionView />;
};

export default LandingPage;
