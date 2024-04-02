import {
  CheckIcon,
  Group,
  Radio,
  RadioGroup,
  Rating,
  Text,
} from '@mantine/core';
import { FilterModel } from '~/helpers/shared-model';

type RatingFilterProps = {
  onRatingChange: (_rating: string) => void;
  selectedRating: string;
  ratings: FilterModel['rating'];
};

export default function RatingFilter({
  onRatingChange,
  selectedRating,
  ratings,
}: RatingFilterProps) {
  return (
    <RadioGroup onChange={onRatingChange} value={selectedRating}>
      {ratings?.map((rating, index) => (
        <Radio
          size="xs"
          key={index}
          icon={CheckIcon}
          value={rating.value.toString()}
          styles={{
            body: { alignItems: 'center', cursor: 'pointer' },
          }}
          label={
            <Group gap="xs" align="center">
              <Rating size="sm" value={4.5} fractions={2} readOnly />
              <Text size="sm">
                ({rating.count}) {rating.label} & up
              </Text>
            </Group>
          }
        />
      ))}
    </RadioGroup>
  );
}
