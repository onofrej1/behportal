import { Suspense } from "react";
//import CalendarDemo from "./_components/calendar";
import { getEvents } from "@/actions/events";
import BigCalendar from "./_components/big-calendar";

export default function Test() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BigCalendar promise={getEvents()} />
      </Suspense>
    </div>
  );
}
