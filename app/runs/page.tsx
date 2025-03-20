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
import "./_components/calendar.css";
import { FormField, MultiSelectFilterType } from "@/types/resources";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { createEvent, getEvent, updateEvent } from "@/actions/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEvent } from "@/validation";
import { createRun, getRunById, updateRun } from "@/actions/runs";
import { getResourceData } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Table } from "@/components/table/table";
import {
  tableColumns,
  tableFilters,
} from "../../app/runs/_components/event-table-config";

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

export default function BigCalendar({}: //promise,
{
  promise: Promise<Event[]>;
}) {
  const [dataView, setDataView] = useState("table");
  const searchParams = useSearchParams();
  const {
    page,
    perPage,
    sort = "",
    joinOperator = "AND",
    filters,
  } = Object.fromEntries(searchParams.entries());
  const advancedFilter = true;

  const baseFilters: any[] = [];
  if (!advancedFilter) {
    tableFilters.forEach((field) => {
      const value = searchParams.get(field.name);
      const isMultiSelect = field.type === "multi-select";
      if (value) {
        baseFilters.push({
          id: field.name,
          type: field.type,
          operator: isMultiSelect ? "eq" : "iLike",
          value: isMultiSelect ? value.split(",") : value,
          search: (field as MultiSelectFilterType).search,
        });
      }
    });
  }

  const skip = (Number(page) || 1) - 1;
  const take = Number(perPage) || 10;

  const query = {
    take: take,
    skip: skip * take,
    filters: advancedFilter ? filters : JSON.stringify(baseFilters),
    joinOperator,
    include: ["venue", "organizer"],
    sort,
  };

  const { promise } = useQuery({
    experimental_prefetchInRender: true,
    queryKey: [
      "getResourceData",
      "events",
      query.skip,
      query.take,
      query.sort,
      query.filters,
      query.joinOperator,
    ],
    queryFn: () => getResourceData({ resource: "events", data: query }),
  });

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
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
  //const data = use(promise);

  /*const events = data.map((e) => {
    return {
      id: e.id,
      title: e.name,
      start: new Date(e.startDate),
      end: new Date(e.endDate),
      color: e.color || "blue",
    };
  });*/
  const events: any[] = [];

  const submitEventForm = (data: Event) => {
    data.id ? updateEvent(data) : createEvent(data);
    setIsEventDialogOpen(false);
  };

  const openEditEventModal = async (event: any) => {
    const data = await getEvent(Number(event.id));
    setSelectedEvent(data);
    setIsEventDialogOpen(true);
  };

  const openAddEventModal = (slotInfo: SlotInfo) => {
    const data = {
      startDate: slotInfo.start,
      endDate: slotInfo.start,
      status: "New event",
    };
    setSelectedEvent(data);
    setIsEventDialogOpen(true);
  };

  const submitRunForm = (data: Run) => {
    console.log(data);
    data.id ? updateRun(data) : createRun(data);
    setIsRunDialogOpen(false);
  };

  const openEditRunModal = async (runId: number) => {
    const data = await getRunById(runId);
    setSelectedRun(data);
    setIsRunDialogOpen(true);
  };

  const openAddRunModal = () => {
    const data = {};
    setSelectedRun(data);
    setIsRunDialogOpen(true);
  };

  const runForm = (data?: Partial<Run>) => {
    const fields: FormField[] = [
      { name: "runId", type: "hidden" },
      { name: "title", label: "Title", type: "text" },
      { name: "distance", label: "Distance", type: "number" },
      { name: "price", label: "Registration fee", type: "number" },
      { name: "elevation", label: "Elevation", type: "number" },
      //{ name: "maxAttendees", label: "Max attendees", type: "number" },
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
      <Form fields={fields} action={submitRunForm} data={data}>
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
      { name: "startDate", type: "date-picker", label: "Start date" },
      { name: "endDate", type: "date-picker", label: "End date" },
      {
        name: "organizerId",
        type: "select",
        label: "Organizer",
        options: [], // getSelectOptions(organizers, "name"),
      },
      {
        name: "eventTypeId",
        type: "foreignKey",
        relation: "eventType",
        label: "Event type",
        resource: "eventTypes",
        renderLabel: (row) => row.type,
      },
      { name: "contact", label: "Contact", type: "text" },
    ];
    if (data?.id) {
      fields = fields.concat([{ name: "id", type: "hidden" }]);
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Event</DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          validation={CreateEvent}
          action={submitEventForm}
          data={data}
        >
          {({ fields }) => (
            <>
              <div className="flex flex-col gap-3 pb-4">
                {fields.name}
                {fields.description}
                {fields.location}
                <div className="flex gap-2">
                  <div className="flex-1">{fields.startDate}</div>
                  <div className="flex-1">{fields.endDate}</div>
                </div>
                {fields.organizerId}
                {fields.eventTypeId}
              </div>

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </>
          )}
        </Form>

        {/*<h1 className="text-xl">Manage runs</h1>
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
            </Button>*/}
      </>
    );
  };

  return (
    <div>
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-h-screen overflow-y-scroll">
          {eventForm(selectedEvent)}
        </DialogContent>
      </Dialog>

      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>{runForm(selectedRun)}</DialogContent>
      </Dialog>

      <Button
        className="mb-3"
        onClick={() => setIsEventDialogOpen(true)}
        variant="outline"
      >
        Add new event
      </Button>

      {dataView === "table" && (
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <Table
            columns={tableColumns}
            filters={tableFilters}
            advancedFilter={true}
            dataPromise={promise}
          />
        </React.Suspense>
      )}

      {dataView === "calendar" && (
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
      )}
    </div>
  );
}
