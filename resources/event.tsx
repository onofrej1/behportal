import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Resource } from "@/types/resources";
import { CreateEvent } from "@/validation";
import { Event } from "@prisma/client";

const event: Resource = {
  name: "Event",
  name_plural: "Events",
  model: "event",
  resource: "events",
  rules: CreateEvent,
  advancedFilter: false,
  menuIcon: "",
  renderForm: ({ fields }) => {
    return (
      <div className="flex flex-col gap-4">
        {fields.name}
        {fields.description}
        {fields.eventTypeId}
        {fields.info}
        {fields.contact}
        {fields.location}
        <div className="flex gap-2">
          <div className="flex-1">{fields.startDate}</div>
          <div className="flex-1">{fields.endDate}</div>
        </div>
        {/* fields.maxAttendees */}
        {/* fields.venueId */}
        {fields.organizerId}
        {fields.eventUrl}
        {fields.registrationLink}
        {fields.resultsLink}
        {fields.galleriesLink}
        <Button type="submit">Save</Button>
      </div>
    );
  },
  relations: ["venue", "organizer"],
  filter: [
    { name: "startDate", type: "date", label: "Start date" },
    { name: "name", type: "text", label: "Title" },
    {
      type: "multi-select",
      name: "venue",
      label: "Venue",
      resource: "venues",
      renderOption: (row: Event) => row.location,
      search: "venue",
    },
  ],
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "text", label: "Description" },
    { name: "status", type: "text", label: "Status" },
    { name: "color", type: "text", label: "Color" },
    { name: "contact", type: "text", label: "Contact" },
    { name: "location", type: "text", label: "Location" },
    { name: "info", type: "richtext", label: "Info", contentClassName: "min-h-[400px]" },
    { name: "eventUrl", type: "text", label: "Event url" },
    { name: "resultsLink", type: "text", label: "Results link" },
    { name: "galleriesLink", type: "text", label: "Galleries link" },
    { name: "registrationLink", type: "text", label: "Registration link" },
    //{ name: "maxAttendees", type: "number", label: "Max attendees" },
    { name: "startDate", type: "date-picker", label: "Start date" },
    { name: "endDate", type: "date-picker", label: "End date" },
    {
      name: "eventTypeId",
      type: "foreignKey",
      relation: "eventType",
      label: "Event type",
      resource: "eventTypes",
      renderLabel: (row) => row.type,
    },
    {
      name: "venueId",
      type: "foreignKey",
      relation: "venue",
      label: "Venue",
      resource: "venues",
      renderLabel: (row) => row.location,
    },
    {
      name: "organizerId",
      type: "foreignKey",
      relation: "organizer",
      label: "Organizer",
      resource: "organizers",
      renderLabel: (row) => row.name,
    },
  ],
  list: [
    { name: "name", header: "Name" },
    {
      name: "startDate",
      header: "Start date",
      render: ({ row }) => (
        <span>{formatDate(row.startDate)}</span>
      ),
    },
    {
      name: "endDate",
      header: "End date",
      render: ({ row }) => (
        <span>{formatDate(row.endDate)}</span>
      ),
    },
    {
      name: "status",
      header: "Status",
      render: ({ row }) => <span>{row.status}</span>,
    },
    {
      name: "venue",
      header: "Venue",
      render: ({ row }) => <span>{row.venue?.location}</span>,
    },
  ],
};
export { event };
