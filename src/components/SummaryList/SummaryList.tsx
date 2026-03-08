import { List, ThemeIcon } from '@mantine/core';
import { IconSun, IconCurrencyKroneDanish, IconDevices } from '@tabler/icons-react';
import { FC } from 'react';

interface SummaryListProps {
  consumedKw: number;
  averagePrice: number;
  priceForDevice: number;
}

const SummaryList: FC<SummaryListProps> = (props: SummaryListProps) => {
  const { averagePrice, consumedKw, priceForDevice } = props;

  return (
    <>
      <List spacing="xs" size="sm" withPadding={false} listStyleType="none">
        <List.Item
          icon={
            <ThemeIcon color="blue" size={24} radius="md">
              <IconSun size={16} />
            </ThemeIcon>
          }
        >
          Consumed: <b>{consumedKw} kWh</b>
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="blue" size={24} radius="md">
              <IconCurrencyKroneDanish size={16} />
            </ThemeIcon>
          }
        >
          Average kilowatt price: <b>{averagePrice} øre</b>
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="blue" size={24} radius="md">
              <IconDevices size={16} />
            </ThemeIcon>
          }
        >
          Price for device: <b>{priceForDevice.toFixed(0)} kr</b>
        </List.Item>
      </List>
    </>
  );
};

export default SummaryList;

