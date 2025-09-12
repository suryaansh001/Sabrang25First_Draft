'use client';

import CountdownClock from '../../../components/CountdownTimer';

export default function TimerPage() {
  // A fixed date in the future for the countdown to target.
  // This ensures the countdown is consistent across all users and page loads.
  // Example: February 20, 2025, 10:00 AM UTC
  const countdownTargetDate = new Date('2025-02-20T10:00:00.000Z').toISOString();

  return (
    <CountdownClock targetDate={countdownTargetDate} />
  );
}