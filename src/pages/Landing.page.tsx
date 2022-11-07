import { ActionIcon } from "@mantine/core";
import { FC, useState } from "react";
import ShellyLogin from "../components/ShellyLogin/ShellyLogin";
import { useAuthContext } from "../context/auth.context";
import ConsumptionPage from "./Consumption.page";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { Direction } from "../enums/direction.enum";

const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const LandingPage: FC = () => {
  const { loggedIntoShelly } = useAuthContext();

  const date = new Date();
  const currentMonth = date.getMonth();
  const [month, setMonth] = useState<number>(currentMonth);
  const [direction, setDirection] = useState<Direction>("before");

  const pageToPrevious = () => {
    setMonth((current) => current - 1);
    setDirection("before");
  };

  const pageToNext = () => {
    setMonth((current) => current + 1);
    setDirection("after");
  };

  if (!loggedIntoShelly) return <ShellyLogin />;

  return (
    <>
      <ConsumptionPage month={month} direction={direction} />

      <div className="button-row">
        <ActionIcon
          onClick={pageToPrevious}
          variant="subtle"
          title="Previous month"
          size="xl"
          color="blue"
        >
          <IconArrowLeft />
        </ActionIcon>

        <p>{months.find((m) => m.value === month.toString())?.label}</p>

        <ActionIcon
          disabled={
            months.find((m) => m.value === month.toString())?.value ===
            currentMonth.toString()
          }
          onClick={pageToNext}
          variant="subtle"
          title="Next month"
          size="xl"
          color="blue"
        >
          <IconArrowRight />
        </ActionIcon>
      </div>
    </>
  );
};

export default LandingPage;
