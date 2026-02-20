import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function useCountdown(targetDate: string | Date): CountdownResult {
  const calculateTimeLeft = useCallback((): CountdownResult => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds: Math.floor(difference / 1000),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

// Hook for multiple countdowns
export function useMultipleCountdowns(dates: { id: string; date: string | Date }[]) {
  const [countdowns, setCountdowns] = useState<Record<string, CountdownResult>>({});

  useEffect(() => {
    const calculateAll = () => {
      const results: Record<string, CountdownResult> = {};
      
      dates.forEach(({ id, date }) => {
        const now = new Date().getTime();
        const target = new Date(date).getTime();
        const difference = target - now;

        if (difference <= 0) {
          results[id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
            totalSeconds: 0,
          };
        } else {
          results[id] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            isExpired: false,
            totalSeconds: Math.floor(difference / 1000),
          };
        }
      });

      setCountdowns(results);
    };

    calculateAll();
    const timer = setInterval(calculateAll, 1000);

    return () => clearInterval(timer);
  }, [dates]);

  return countdowns;
}

// Hook for countdown with callbacks
export function useCountdownWithCallbacks(
  targetDate: string | Date,
  callbacks?: {
    onExpire?: () => void;
    onMinuteChange?: (minutes: number) => void;
    onHourChange?: (hours: number) => void;
    onDayChange?: (days: number) => void;
  }
): CountdownResult {
  const [prevTimeLeft, setPrevTimeLeft] = useState<CountdownResult | null>(null);
  const timeLeft = useCountdown(targetDate);

  useEffect(() => {
    if (!prevTimeLeft) {
      setPrevTimeLeft(timeLeft);
      return;
    }

    // Check for expiration
    if (timeLeft.isExpired && !prevTimeLeft.isExpired) {
      callbacks?.onExpire?.();
    }

    // Check for minute change
    if (timeLeft.minutes !== prevTimeLeft.minutes) {
      callbacks?.onMinuteChange?.(timeLeft.minutes);
    }

    // Check for hour change
    if (timeLeft.hours !== prevTimeLeft.hours) {
      callbacks?.onHourChange?.(timeLeft.hours);
    }

    // Check for day change
    if (timeLeft.days !== prevTimeLeft.days) {
      callbacks?.onDayChange?.(timeLeft.days);
    }

    setPrevTimeLeft(timeLeft);
  }, [timeLeft, prevTimeLeft, callbacks]);

  return timeLeft;
}

// Format countdown for display
export function formatCountdown(
  countdown: CountdownResult,
  options?: {
    showSeconds?: boolean;
    compact?: boolean;
    labels?: {
      days?: string;
      hours?: string;
      minutes?: string;
      seconds?: string;
    };
  }
): string {
  const { showSeconds = true, compact = false, labels = {} } = options || {};
  const { days, hours, minutes, seconds } = countdown;

  const {
    days: daysLabel = compact ? 'd' : 'hari',
    hours: hoursLabel = compact ? 'h' : 'jam',
    minutes: minutesLabel = compact ? 'm' : 'menit',
    seconds: secondsLabel = compact ? 's' : 'detik',
  } = labels;

  if (compact) {
    const parts = [`${days}${daysLabel}`, `${hours}${hoursLabel}`, `${minutes}${minutesLabel}`];
    if (showSeconds) parts.push(`${seconds}${secondsLabel}`);
    return parts.join(' ');
  }

  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days} ${daysLabel}`);
  if (hours > 0 || days > 0) parts.push(`${hours} ${hoursLabel}`);
  parts.push(`${minutes} ${minutesLabel}`);
  if (showSeconds) parts.push(`${seconds} ${secondsLabel}`);

  return parts.join(', ');
}

// Countdown component helper
export interface CountdownSegment {
  value: number;
  label: string;
}

export function getCountdownSegments(countdown: CountdownResult): CountdownSegment[] {
  return [
    { value: countdown.days, label: 'Hari' },
    { value: countdown.hours, label: 'Jam' },
    { value: countdown.minutes, label: 'Menit' },
    { value: countdown.seconds, label: 'Detik' },
  ];
}
