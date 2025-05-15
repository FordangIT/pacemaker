/**
 * Calculate the sound interval (in milliseconds) for a running pace and stride length.
 *
 * @param paceStr - Pace in the format "5:30"
 * @param strideCm - Stride length in centimeters
 * @returns number - Interval in milliseconds
 */

export function calculateStepIntervalMs(
  paceStr: string,
  strideCm: number
): number {
  const match = paceStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 500;

  const min = parseInt(match[1], 10);
  const sec = parseInt(match[2], 10);
  const totalSeconds = min * 60 + sec;

  const strideMeters = strideCm / 100;
  const stepsPerKm = 1000 / strideMeters;

  const interval = (totalSeconds / stepsPerKm) * 1000;
  return interval;
}
