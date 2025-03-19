"use client";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  View,
  Views,
} from "react-big-calendar";
import { use, useCallback, useState } from "react";
import { Event, Run } from "@prisma/client";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, getDay, parse, startOfWeek } from "date-fns";
import "./calendar.css";
import { FormField } from "@/types/resources";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { createEvent, getEvent, updateEvent } from "@/actions/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEvent } from "@/validation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createRun, getRunById, updateRun } from "@/actions/runs";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BigCalendar({
  promise,
}: {
  promise: Promise<Event[]>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<Partial<Event & { runs: Run[] }>>();
  const [selectedRun, setSelectedRun] = useState<Partial<Run>>();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());
  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );
  const data = use(promise);

  const events = data.map((e) => {
    return {
      id: e.id,
      title: e.name,
      start: new Date(e.startDate),
      end: new Date(e.endDate),
      color: e.color || "blue",
    };
  });

  const sendForm = (data: Event) => {
    data.id ? updateEvent(data) : createEvent(data);
    setIsOpen(false);
  };

  const openEditEventModal = async (event: any) => {
    const data = await getEvent(Number(event.id));
    setSelectedEvent(data);
    setIsOpen(true);
  };

  const openAddEventModal = (slotInfo: SlotInfo) => {
    const data = {
      startDate: slotInfo.start,
      endDate: slotInfo.start,
      status: "New event",
    };
    setSelectedEvent(data);
    setIsOpen(true);
  };

  const saveForm = (data: Run) => {
    console.log(data);
    data.id ? updateRun(data) : createRun(data);
    setIsOpen(false);
  };

  const openEditRunModal = async (runId: number) => {
    const data = await getRunById(runId);
    setSelectedRun(data);
    setIsRunModalOpen(true);
  };

  const openAddRunModal = () => {
    const data = {};
    setSelectedRun(data);
    setIsRunModalOpen(true);
  };

  const runForm = (data?: Partial<Run>) => {
    const fields: FormField[] = [
      { name: "runId", type: "hidden" },
      { name: "title", label: "Title", type: "text" },
      { name: "distance", label: "Distance", type: "number" },
      { name: "price", label: "Registration fee", type: "number" },
      { name: "elevation", label: "Elevation", type: "number" },
      {
        name: "surface",
        type: "select",
        label: "Surface",
        options: [
          { label: "Road", value: "road" },
          { label: "Trail", value: "trail" },
        ],
      },
    ];

    return (
      <Form
        fields={fields}
        //validation={CreateEvent}
        action={saveForm}
        data={data}
      >
        {({ fields }) => (
          <>
            <DialogHeader>
              <DialogTitle>Add / Edit run</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="mt-3">
              <div className="flex flex-col gap-3 pb-4">
                {fields.title}
                {fields.distance}
                {fields.price}
                {fields.elevation}
                {fields.surface}
              </div>
            </div>

            <Button className="w-full" type="submit">
              Save run
            </Button>
          </>
        )}
      </Form>
    );
  };

  const eventForm = (data?: Partial<Event>) => {
    let fields: FormField[] = [
      { name: "name", label: "Name", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "color", label: "Color", type: "text" },
      { name: "status", label: "Status", type: "text" },
      { name: "maxAttendees", label: "Max attendees", type: "number" },
      { name: "contact", label: "Contact", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "startDate", type: "date-picker", label: "Start date" },
      { name: "endDate", type: "date-picker", label: "End date" },
      {
        name: "organizerId",
        type: "select",
        label: "Organizer",
        options: [], // getSelectOptions(organizers, "name"),
      },
      {
        name: "venueId",
        type: "select",
        label: "Venue",
        options: [], // getSelectOptions(venues, "location"),
      },
    ];
    if (data?.id) {
      fields = fields.concat([{ name: "id", type: "hidden" }]);
    }

    return (
      <>
        <SheetHeader>
          <SheetTitle>Event</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="event">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="runs">Runs</TabsTrigger>
          </TabsList>
          <TabsContent value="event">
            <Form
              fields={fields}
              validation={CreateEvent}
              action={sendForm}
              data={data}
            >
              {({ fields }) => (
                <>
                  <div className="flex flex-col gap-3 pb-4">
                    {fields.name}
                    {fields.description}
                    <div className="flex gap-2">
                      <div className="flex-1">{fields.color}</div>
                      <div className="flex-1">{fields.status}</div>
                    </div>
                    {fields.location}
                    {fields.startDate}
                    {fields.endDate}
                    {fields.organizerId}
                    {fields.venueId}
                    {fields.maxAttendees}
                  </div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </>
              )}
            </Form>
          </TabsContent>

          <TabsContent value="runs">
            <h1 className="text-xl">Manage runs</h1>
            {selectedEvent?.runs?.map((run) => (
              <div key={run.id} className="my-3 flex justify-between">
                <div>{run.title}</div>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => openEditRunModal(run.id)}
                >
                  Edit
                </Button>
              </div>
            ))}
            <Button type="button" onClick={openAddRunModal}>
              Add run
            </Button>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <div>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          console.log(selectedRun);
          if (selectedRun) setIsOpen(false);
          setIsOpen(open);
        }}
      >
        <SheetContent
          onInteractOutside={(event) => event.preventDefault()}
          className="max-h-screen overflow-y-scroll"
        >
          {eventForm(selectedEvent)}
        </SheetContent>
      </Sheet>

      <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
        <DialogContent>{runForm(selectedRun)}</DialogContent>
      </Dialog>

      {/*<Sheet open={false}>
        <SheetContent className="max-h-screen overflow-y-scroll"></SheetContent>
      </Sheet>*/}

      <Button>Add new event</Button>

      <Calendar
        view={view}
        onView={setView}
        date={date}
        onNavigate={onNavigate}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={openEditEventModal}
        onSelectSlot={openAddEventModal}
        style={{ height: 700 }}
      />

      <Dialog open={false} /*onOpenChange={setIsOpen}*/>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
