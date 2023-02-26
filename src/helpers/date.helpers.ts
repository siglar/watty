import { format } from 'date-fns';

export const getFirstDay = (year: number, month: number) => {
  const date = new Date(year, month);
  const firstDay = new Date(date.getFullYear(), month, 1);

  return format(firstDay, 'yyyy-MM-dd');
};

export const getLastDay = (year: number, month: number) => {
  const date = new Date(year, month);
  const lastDay = new Date(date.getFullYear(), month + 1, 0);

  lastDay.setDate(lastDay.getDate());

  return format(lastDay, 'yyyy-MM-dd');
};
