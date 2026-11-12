'use client';

import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const Booking = lazy(() => import('@/components/booking'));

export function TrialBookingButton({ label = 'Записаться на пробный урок' }: { label?: string }) {
  const [open, setOpen] = useState(false);

  return <>
    <button className="button service-booking-button" type="button" onClick={() => setOpen(true)}>
      {label}<ArrowUpRight size={18} aria-hidden="true"/>
    </button>
    {open && <Suspense fallback={<div className="service-booking-loading" role="status">Загружаем форму записи…</div>}>
      <Booking onClose={() => setOpen(false)} onBooked={() => setOpen(false)}/>
    </Suspense>}
  </>;
}
