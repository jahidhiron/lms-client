import { Radio, RadioGroup, Spoiler, Stack } from '@mantine/core';
import { FilterModel } from '~/helpers/shared-model';

type PriceFilterProps = {
  onPriceChange: (prices: string) => void;
  selectedPrice: string;
  prices: FilterModel['price'];
};

export default function PriceFilter({
  onPriceChange,
  selectedPrice,
  prices,
}: PriceFilterProps) {
  return (
    <Spoiler hideLabel="show less" showLabel="show more">
      <RadioGroup onChange={onPriceChange} value={selectedPrice}>
        <Stack>
          {prices.map((price) => (
            <Radio
              key={price.value}
              value={price.value}
              label={`${price.label} (${price?.count})`}
            />
          ))}
        </Stack>
      </RadioGroup>
    </Spoiler>
  );
}
