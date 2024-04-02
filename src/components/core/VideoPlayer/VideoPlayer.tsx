import {
  ActionIcon,
  Box,
  Center,
  Group,
  Overlay,
  Text,
  Tooltip,
} from '@mantine/core';
import { useHotkeys, useIdle } from '@mantine/hooks';
import {
  IconPlayerPlay,
  IconRewindBackward5,
  IconRewindForward5,
  TablerIconsProps,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef } from 'react';
import { formatTimeFromSeconds } from '~/helpers/utils';
import useVideoPlayerState from '~/libs/store/useVideoPlayerState';
import classes from './VideoPlayer.module.css';
import AutoPlayButton from './components/AutoPlayButton';
import CaptionButton from './components/CaptionButton';
import { CaptionModel } from './components/CaptionButton/CaptionButton';
import MarkerOnOffButton from './components/MarkerOnOffButton';
import MaximizeMinimizeButton from './components/MaximizeMinimizeButton';
import PlayPauseButton from './components/PlayPauseButton';
import PlaybackSpeedButton from './components/PlaybackSpeedButton';
import VideoProgressbar from './components/VideoProgressbar';
import VolumeButton from './components/VolumeButton';

type AddOnsPosition = 'left-start' | 'left-end' | 'right-end' | 'right-start';
type AddOnType = {
  Icon: (_props: TablerIconsProps) => React.JSX.Element;
  label: string;
  onClick: (_currentTime: number) => void;
};
type AddOnsType = Partial<Record<AddOnsPosition, AddOnType[]>>;

type VideoPlayerProps = {
  autoPlay?: boolean;
  reloadId?: string;
  videoSource: string;
  captions: CaptionModel[];
  addons?: AddOnsType;
  markers?: { markInSecond: number; title: string }[];
  onVideoEnd?(): void;
  onVideoProgress?(_currentTime: number): void;
  idleDelay?: number;
  withAutoPlay?: boolean;
  withMarker?: boolean;
  withCaption?: boolean;
};

const initialAddons: AddOnsType = {
  'left-end': [],
  'right-start': [],
  'right-end': [],
  'left-start': [],
};

export default function VideoPlayer({
  reloadId,
  autoPlay,
  videoSource,
  captions,
  onVideoEnd,
  addons = initialAddons,
  markers,
  onVideoProgress,
  idleDelay = 1000,
  withAutoPlay,
  withCaption,
  withMarker,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const {
    containerHovered,
    setContainerHovered,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    bufferedRanges,
    setBufferedRanges,
    duration,
    setDuration,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    isFullscreen,
    setIsFullscreen,
    isCaptionActive,
    setIsCaptionActive,
    caption,
    setCaption,
    isAutoPlay,
    setIsAutoPlay,
  } = useVideoPlayerState();
  const isIdle = useIdle(idleDelay);

  const bufferedValue = useMemo(() => {
    try {
      if (videoRef.current && videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(0);
        const videoDuration = videoRef.current.duration;
        const calculatedBufferedWidth = (bufferedEnd / videoDuration) * 100;
        return calculatedBufferedWidth;
      }
      return 0;
    } catch {
      return 0;
    }
  }, [bufferedRanges, duration]);

  useEffect(() => {
    if (!isPlaying && videoRef?.current?.played) {
      onPause();
    }
  }, [isPlaying]);

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSource, reloadId]);

  useEffect(() => {
    if (isIdle && containerHovered && isPlaying) {
      hideControlBar();
    }
    if (!isIdle && containerHovered) {
      showControlBar();
    }
  }, [isIdle, containerHovered]);

  const hideControlBar = () => {
    if (isPlaying) {
      setContainerHovered(false);
    }
  };

  const showControlBar = () => {
    setContainerHovered(true);
  };

  const onPlay = () => {
    setIsPlaying(true);
    videoRef?.current?.play();
  };

  const onPause = () => {
    setIsPlaying(false);
    showControlBar();
    videoRef?.current?.pause();
  };

  const togglePlaying = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const onPlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const onRewind = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      setCurrentTime(currentTime + amount);
    }
  };

  const onVolumeChange = (volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      setVolume(volume);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .finally(() => {
            setIsFullscreen(false);
          })
          .catch(() => {});
      } else {
        divRef?.current
          ?.requestFullscreen({ navigationUI: 'hide' })
          .finally(() => {
            setIsFullscreen(true);
          });
      }
    }
  };

  const onBufferedChange = () => {
    if (videoRef.current) {
      setBufferedRanges(videoRef.current.buffered);
    }
  };

  const onLoad = () => {
    if (
      currentTime &&
      currentTime !== 0 &&
      videoRef.current?.currentTime == 0 &&
      videoRef.current?.duration !== currentTime
    ) {
      videoRef.current.currentTime = currentTime;
    }
    if (videoRef.current?.duration === currentTime) {
      // @ts-ignore
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    setDuration(videoRef.current?.duration || 0);
    setVolume(videoRef.current?.volume || 0);
    setPlaybackRate(videoRef.current?.playbackRate || 0);
    setBufferedRanges(videoRef?.current?.buffered || null);
    if (autoPlay) {
      onPlay();
    } else {
      onPause();
    }
  };

  const renderAddons = (addons: AddOnType[]) => {
    return addons.map((Addon) => {
      return (
        <Tooltip
          key={Addon.label}
          withinPortal={false}
          label={Addon.label}
          fz="xs"
        >
          <ActionIcon
            variant="light"
            onClick={() => Addon.onClick(currentTime)}
          >
            <Addon.Icon stroke={1} />
          </ActionIcon>
        </Tooltip>
      );
    });
  };

  useHotkeys([['space', () => togglePlaying()]]);

  return (
    <Box
      component="div"
      ref={divRef}
      w="100%"
      pos="relative"
      className={classes.container}
      onMouseEnter={showControlBar}
      onMouseMove={showControlBar}
      onMouseLeave={hideControlBar}
    >
      <video
        ref={videoRef}
        style={{ backgroundColor: 'var(--mantine-color-dark-filled)' }}
        width={'100%'}
        height={'100%'}
        src={videoSource}
        controls={false}
        onTimeUpdate={() => {
          setCurrentTime(videoRef?.current?.currentTime || 0);
          onVideoProgress?.(videoRef?.current?.currentTime || 0);
          if (
            (videoRef?.current?.currentTime as number) >=
            (videoRef?.current?.duration as number)
          ) {
            if (!isAutoPlay) {
              setContainerHovered(true);
            }
            onPause();
            onVideoEnd?.();
          }
        }}
        onLoadedMetadata={onLoad}
        onProgress={onBufferedChange}
      >
        {isCaptionActive && caption && (
          <track
            key={caption.lang}
            src={caption.url}
            kind="subtitles"
            srcLang={caption.lang}
            label={caption.lang}
            default={caption.lang === caption?.lang}
          />
        )}
      </video>
      <Overlay
        zIndex={40}
        w="100%"
        onDoubleClick={toggleFullScreen}
        opacity={isPlaying ? 0 : 0.9}
        onClick={() => {
          if (isPlaying) {
            onPause();
          } else {
            onPlay();
          }
        }}
        h="100%"
      >
        <Center h="100%">
          <ActionIcon variant="outline" size="xl" radius="xl">
            <IconPlayerPlay />
          </ActionIcon>
        </Center>
      </Overlay>

      <Box
        className={classes.controlsContainer}
        opacity={containerHovered ? 1 : 0}
      >
        <VideoProgressbar
          currentValue={currentTime || 0}
          onChange={(value) => {
            if (isPlaying) {
              onPause();
            }
            // @ts-ignore
            videoRef.current.currentTime = value;
            setCurrentTime(value);
          }}
          onChangeEnd={() => {
            if (isPlaying && videoRef?.current?.paused) {
              onPlay();
            }
          }}
          totalLength={duration}
          bufferedValue={`${bufferedValue}%`}
          markers={markers}
        />
        <Group justify="space-between" mt="xs">
          <Group>
            {renderAddons(addons['left-start'] || [])}
            <PlayPauseButton
              isPlaying={isPlaying}
              onToggle={(playing) => {
                if (playing) {
                  onPause();
                } else {
                  onPlay();
                }
              }}
            />

            <Tooltip withinPortal={false} label="Rewind back 5s" fz="xs">
              <ActionIcon onClick={() => onRewind(-5)} variant="light">
                <IconRewindBackward5 stroke={1} />
              </ActionIcon>
            </Tooltip>
            <PlaybackSpeedButton
              playbackRate={playbackRate}
              onPlaybackRateChange={onPlaybackRateChange}
            />
            <Tooltip withinPortal={false} label="Rewind forward 5s" fz="xs">
              <ActionIcon onClick={() => onRewind(5)} variant="light">
                <IconRewindForward5 stroke={1} />
              </ActionIcon>
            </Tooltip>
            <Text c="white" fw="bold" fz="sm">
              {formatTimeFromSeconds(currentTime || 0)} /{' '}
              {formatTimeFromSeconds(duration)}
            </Text>
            {renderAddons(addons['left-end'] || [])}
          </Group>
          <Group>
            {renderAddons(addons['right-start'] || [])}
            {withAutoPlay && (
              <AutoPlayButton
                active={isAutoPlay}
                onChange={(value) => {
                  setIsAutoPlay(value);
                }}
              />
            )}
            <VolumeButton volume={volume} onChange={onVolumeChange} />
            {withMarker && <MarkerOnOffButton />}
            {withCaption && (
              <CaptionButton
                onChange={(cap) => {
                  setCaption(cap);
                }}
                active={isCaptionActive}
                onActiveStateChange={(active) => {
                  setIsCaptionActive(active);
                }}
                captions={captions}
                caption={caption}
              />
            )}
            <MaximizeMinimizeButton
              isFullscreen={isFullscreen}
              onMaximize={toggleFullScreen}
              onMinimize={toggleFullScreen}
            />
            {/* <Menu loop position="top-start">
              <Menu.Target>
                <ActionIcon variant="light">
                  <IconSettings stroke={1} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>0.5x</Menu.Item>
                <Menu.Item>0.75x</Menu.Item>
                <Menu.Item>1x</Menu.Item>
                <Menu.Item>1.25x</Menu.Item>
                <Menu.Item>1.5x</Menu.Item>
                <Menu.Item>1.75x</Menu.Item>
              </Menu.Dropdown>
            </Menu> */}
            {renderAddons(addons['right-end'] || [])}
          </Group>
        </Group>
      </Box>
    </Box>
  );
}
