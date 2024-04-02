import {
  ActionIcon,
  Box,
  Popover,
  Slider,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconPoint } from '@tabler/icons-react';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';
import classes from './VideoProgressbar.module.css';

type VideoProgressbarProps = {
  onChange(_value: number): void;
  onChangeEnd?(_value: number): void;
  currentValue: number;
  bufferedValue: string;
  markers?: { markInSecond: number; title: string }[];
  totalLength: number;
};

export default function VideoProgressbar({
  onChange,
  currentValue,
  bufferedValue,
  onChangeEnd,
  totalLength,
  markers,
}: VideoProgressbarProps) {
  const isShowMarker = useVideoPlayerState((state) => state.isShowMarker);

  return (
    <Box className={classes.progressbar}>
      {isShowMarker &&
        markers?.map((mark, i) => (
          <Box
            key={i}
            className={classes.marker}
            style={{
              ['--marker-width']: `${(mark.markInSecond * 100) / totalLength}%`,
              zIndex: 10000 - mark.markInSecond,
            }}
          >
            <Popover position="top" withinPortal={false}>
              <Popover.Target>
                <ActionIcon size="10" variant="filled" color="dark">
                  <IconPoint color="orange" size="25" />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown maw={400}>
                <TypographyStylesProvider p="0" m="0" c="black">
                  <div dangerouslySetInnerHTML={{ __html: mark.title || '' }} />
                </TypographyStylesProvider>
              </Popover.Dropdown>
            </Popover>
          </Box>
        ))}
      <Slider
        thumbSize={1}
        value={currentValue}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        step={0.01}
        styles={{
          // root: { paddingRight: 0 },
          track: {
            ['--buffered-width' as any]: bufferedValue,
          },
          thumb: { display: 'none' },
        }}
        max={totalLength}
        className={classes.progress}
        classNames={{ track: classes.progressbarTrack }}
      />

      <style>
        {`.${classes.progressbarTrack}::after {
          width: var(--buffered-width);
        }`}
      </style>
    </Box>
  );
}
