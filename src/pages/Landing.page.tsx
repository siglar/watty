import { FC } from "react";
import ShellyLogin from "../components/ShellyLogin/ShellyLogin";

import { useAuthContext } from "../context/auth.context";
import ConsumptionPage from "./Consumption.page";

const LandingPage: FC = () => {
  const { loggedIntoShelly } = useAuthContext();

  if (!loggedIntoShelly) return <ShellyLogin />;

  return <ConsumptionPage />;
};

export default LandingPage;
