import { ActionIcon, Tooltip } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';

type MarkerOnOffButtonProps = {};

export default function MarkerOnOffButton({}: MarkerOnOffButtonProps) {
  const isShowMarker = useVideoPlayerState((state) => state.isShowMarker);
  const setIsShowMarker = useVideoPlayerState((state) => state.setIsShowMarker);

  if (isShowMarker) {
    return (
      <Tooltip label="Hide Marker">
        <ActionIcon
          onClick={() => {
            setIsShowMarker(false);
          }}
          variant="light"
        >
          <IconEye stroke={1} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip label="Show Marker">
      <ActionIcon
        onClick={() => {
          setIsShowMarker(true);
        }}
        variant="light"
      >
        <IconEyeOff stroke={1} />
      </ActionIcon>
    </Tooltip>
  );
}
