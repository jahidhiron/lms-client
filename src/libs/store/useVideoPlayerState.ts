import { create } from 'zustand';
import { CaptionModel } from '~/components/core/VideoPlayer/components/CaptionButton/CaptionButton';

interface VideoPlayerState {
  containerHovered: boolean;
  isPlaying: boolean;
  currentTime: number;
  bufferedRanges: TimeRanges | null;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  isCaptionActive: boolean;
  caption: CaptionModel | undefined;
  isAutoPlay: boolean;
  isShowMarker: boolean;
}

interface VideoPlayerActions {
  setContainerHovered: (hovered: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (seconds: number) => void;
  setBufferedRanges: (ranges: TimeRanges | null) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setIsCaptionActive: (active: boolean) => void;
  setCaption: (caption: CaptionModel | undefined) => void;
  setIsAutoPlay: (active: boolean) => void;
  setIsShowMarker: (show: boolean) => void;
}

const useVideoPlayerState = create<VideoPlayerState & VideoPlayerActions>(
  (set) => ({
    containerHovered: false,
    isPlaying: false,
    currentTime: 0,
    bufferedRanges: null,
    duration: 0,
    volume: 0,
    playbackRate: 0,
    isFullscreen: false,
    isCaptionActive: false,
    caption: undefined,
    isAutoPlay: false,
    isShowMarker: false,

    setContainerHovered: (hovered) => set({ containerHovered: hovered }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setCurrentTime: (seconds) => set({ currentTime: seconds }),
    setBufferedRanges: (ranges) => set({ bufferedRanges: ranges }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
    setPlaybackRate: (rate) => set({ playbackRate: rate }),
    setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
    setIsCaptionActive: (active) => set({ isCaptionActive: active }),
    setCaption: (caption) => set({ caption }),
    setIsAutoPlay: (active) => set({ isAutoPlay: active }),
    setIsShowMarker: (show) => set({ isShowMarker: show }),
  })
);

export default useVideoPlayerState;
