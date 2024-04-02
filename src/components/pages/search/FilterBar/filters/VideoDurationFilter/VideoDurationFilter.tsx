import { Radio, RadioGroup, Spoiler, Stack } from '@mantine/core';
import { FilterModel } from '~/helpers/shared-model';

type VideoDurationFilterProps = {
  onDurationChange: (_durations: string) => void;
  selectedDuration: string;
  durations: FilterModel['duration'];
};

export default function VideoDurationFilter({
  onDurationChange,
  selectedDuration,
  durations,
}: VideoDurationFilterProps) {
  return (
    <Spoiler hideLabel="show less" showLabel="show more">
      <RadioGroup onChange={onDurationChange} value={selectedDuration}>
        <Stack>
          {durations.map((duration) => (
            <Radio
              key={duration.value}
              value={duration.value}
              label={`${duration.label} (${duration?.count})`}
            />
          ))}
        </Stack>
      </RadioGroup>
    </Spoiler>
  );
}
