import { Button } from '@mantine/core';
import { useInterval, useSessionStorage } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';
import { TIMER_MIN_KEY, TIMER_SEC_KEY } from '~/helpers/constants';

type TimerButtonProps = {
  initialTimer: {
    minute: number;
    second: number;
  };
  onPress: (_resolver: () => void, _rej: () => void) => void;
  placeholder: string;
  triggerOnMount?: boolean;
};

export default function TimerButton({
  initialTimer,
  placeholder,
  onPress,
}: TimerButtonProps) {
  const [loading, setLoading] = useState(false);

  const [min, setMin] = useSessionStorage<number>({
    key: TIMER_MIN_KEY,
    defaultValue: initialTimer.minute,
  });
  const [sec, setSec] = useSessionStorage<number>({
    key: TIMER_SEC_KEY,
    defaultValue: initialTimer.second,
  });
  const timer = () => {
    setSec((prev) => prev - 1);
  };
  const interval = useInterval(timer, 1000);

  useEffect(() => {
    if (min! <= 0 && sec! <= 0) {
      interval.stop();
      onReset();
    } else if (min! > 0 && sec! <= 0) {
      setMin((prev) => prev - 1);
      setSec(59);
    }
  }, [min, sec]);

  useEffect(() => {
    if (
      !interval.active &&
      (min != initialTimer.minute || sec != initialTimer.second)
    ) {
      interval.start();
    }
  }, [min, sec]);

  useEffect(() => {
    interval.start();
  }, []);

  const onReset = () => {
    setMin(initialTimer.minute);
    setSec(initialTimer.second);
  };

  const onStart = useCallback(() => {
    setLoading(true);
    new Promise((res, rej) => {
      try {
        onPress(() => res(0), rej);
      } catch (err) {
        rej(err);
      }
    })
      .then(() => {
        interval.start();
      })
      .catch((_err) => {})
      .finally(() => setLoading(false));
  }, [min, sec]);

  return (
    <Button
      onClick={onStart}
      disabled={interval.active}
      w={150}
      fullWidth
      variant="outline"
      loading={loading}
    >
      {interval.active ? `${min} : ${sec}` : placeholder}
    </Button>
  );
}
