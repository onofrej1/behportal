'use client'
import { use, useState } from 'react'
import Calendar from '@/components/calendar/calendar'
import { Mode } from '@/components/calendar/calendar-types'
import { Event } from '@prisma/client'

export default function CalendarDemo({ promise }: {promise: Promise<Event[]> }) {
  const [mode, setMode] = useState<Mode>('month')
  const [date, setDate] = useState<Date>(new Date())
  const data = use(promise);

  const events = data.map(e => {
    return {
      id: e.id.toString(),
      title: e.name,
      start: new Date(e.startDate),
      end: new Date(e.endDate),
      color: e.color || 'blue',
    };
  });

  return (
    <Calendar
      events={events}
      setEvents={() => null}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}
