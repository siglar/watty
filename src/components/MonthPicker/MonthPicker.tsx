import { ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Dispatch, FC, SetStateAction } from 'react';
import './MonthPicker.css';

const months = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' }
];

interface MonthPickerProps {
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const MonthPicker: FC<MonthPickerProps> = (props: MonthPickerProps) => {
  const { month, setMonth, year, setYear } = props;

  const pageToPrevious = () => {
    if (month - 1 === -1) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth((current) => current - 1);
    }
  };

  const pageToNext = () => {
    if (month + 1 === 12) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth((current) => current + 1);
    }
  };

  const disableNext = () => {
    return months.find((m) => m.value === month.toString())?.value === currentMonth.toString() && currentYear === year;
  };

  return (
    <div className="button-row">
      <ActionIcon onClick={pageToPrevious} variant="subtle" title="Previous month" size="xl" color="blue">
        <IconArrowLeft />
      </ActionIcon>

      <div className="date-actions">
        <p>{year}</p>
        <p>{months.find((m) => m.value === month.toString())?.label}</p>
      </div>
      <ActionIcon disabled={disableNext()} onClick={pageToNext} variant="subtle" title="Next month" size="xl" color="blue">
        <IconArrowRight />
      </ActionIcon>
    </div>
  );
};

export default MonthPicker;
