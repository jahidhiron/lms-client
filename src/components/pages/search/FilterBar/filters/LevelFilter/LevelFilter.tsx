import { Radio, RadioGroup, Spoiler, Stack } from '@mantine/core';
import { FilterModel } from '~/helpers/shared-model';

type LevelFilterProps = {
  onLevelChange: (_levels: string) => void;
  selectedLevel: string;
  levels: FilterModel['level'];
};

export default function LevelFilter({
  onLevelChange,
  selectedLevel,
  levels,
}: LevelFilterProps) {
  return (
    <Spoiler hideLabel="show less" showLabel="show more">
      <RadioGroup onChange={onLevelChange} value={selectedLevel}>
        <Stack>
          {levels.map((level) => (
            <Radio
              key={level.value}
              value={level.value}
              label={`${level.label} (${level?.count})`}
            />
          ))}
        </Stack>
      </RadioGroup>
    </Spoiler>
  );
}
