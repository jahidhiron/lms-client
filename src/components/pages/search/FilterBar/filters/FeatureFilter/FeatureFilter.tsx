import { Checkbox, Spoiler, Stack } from '@mantine/core';
import { FilterModel } from '~/helpers/shared-model';

type FeatureFilterProps = {
  onFeatureChange: (_features: string[]) => void;
  selectedFeature: string[];
  features: FilterModel['features'];
};

export default function FeatureFilter({
  onFeatureChange,
  selectedFeature,
  features,
}: FeatureFilterProps) {
  return (
    <Spoiler hideLabel="show less" showLabel="show more">
      <Stack>
        {features.map((feature, index) => (
          <Checkbox
            key={feature.value}
            value={feature.value}
            label={`${feature.label} (${feature?.count})`}
            onChange={(ev) => {
              if (!ev.target.checked) {
                selectedFeature[index] = '';
                onFeatureChange(selectedFeature);
              } else {
                selectedFeature[index] = ev.target.value;
                onFeatureChange(selectedFeature);
              }
            }}
            checked={selectedFeature[index] === feature?.value}
          />
        ))}
      </Stack>
    </Spoiler>
  );
}
