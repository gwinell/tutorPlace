'use client';

import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { setAnalyticsPrivate } from '@/lib/analytics-scope';

const Booking = lazy(() => import('@/components/booking'));

export function TrialBookingButton({ label = 'Записаться на пробный урок' }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => { setOpen(false); setAnalyticsPrivate('booking-button', false); };

  return <>
    <button className="button service-booking-button" type="button" onClick={() => { setAnalyticsPrivate('booking-button', true); setOpen(true); }}>
      {label}<ArrowUpRight size={18} aria-hidden="true"/>
    </button>
    {open && <Suspense fallback={<div className="service-booking-loading" role="status">Загружаем форму записи…</div>}>
      <Booking onClose={close} onBooked={close}/>
    </Suspense>}
  </>;
}
