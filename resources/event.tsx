import { TableData } from "@/types/resources";
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/resources';
import { CreateEvent } from "@/validation";

const event: Resource = {
  name: 'Event',
  name_plural: 'Events',
  model: 'event',
  resource: 'events',
  rules: CreateEvent,
  group: 'Events',
  menuIcon: '',
  renderForm: ({ fields }) => {
    return (
      <div className='flex flex-col gap-4'>
        {fields.name}
        {fields.description}
        {fields.status}
        {fields.color}
        {fields.contact}
        {fields.location}
        {fields.venue}
        <div className='flex gap-2'>
          <div className='flex-1'>
            {fields.startDate}
          </div>
          <div className='flex-1'>
            {fields.endDate}
          </div>
        </div>
        {fields.maxAttendees}        
        {fields.venueId}
        {fields.organizerId}
        <Button type="submit">Save</Button>
      </div>
    );
  },
  relations: ['venue', 'organizer'],
  filter: [
    { name: "startDate", type: "date", label: "Start date" },
    { name: "name", type: "text", label: "Title" },
    { name: "maxAttendees", type: "number", label: "Max attendees" },
    {
      type: "multi-select",
      name: "venue",
      label: "Venue",
      resource: "venues",
      fields: ["id", "location"],
      search: "venue",
    },
  ],
  form: [
    { name: 'name', type: 'text', label: 'Name' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'status', type: 'text', label: 'Status' },
    { name: 'color', type: 'text', label: 'Color' },
    { name: 'contact', type: 'text', label: 'Contact' },
    { name: 'location', type: 'text', label: 'Location' },
    { name: 'maxAttendees', type: 'number', label: 'Max attendees' },
    { name: 'startDate', type: 'date-picker', label: 'Start date' },
    { name: 'endDate', type: 'date-picker', label: 'End date' },    
    {
      name: 'venueId', 
      type: 'foreignKey',
      relation: 'venue',
      label: 'Venue',
      resource: 'venues',
      renderLabel: (row) => row.location,
    },
    {
      name: 'organizerId', 
      type: 'foreignKey',
      relation: 'organizer',
      label: 'Organizer',
      resource: 'organizers',
      renderLabel: (row) => row.name,
    },    
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'name', header: 'Name' },
    { name: 'startDate', header: 'Start date', render: (row: TableData) => <span>{new Date(row.startDate).toLocaleDateString()}</span> },
    { name: 'endDate', header: 'End date', render: (row: TableData) => <span>{new Date(row.endDate).toLocaleDateString()}</span> },
    { name: 'status', header: 'Status', render: (row: TableData) => <span>{row.status}</span> },
    { name: 'venue', header: 'Venue', render: (row: TableData) => <span>{row.venue?.location}</span> },
  ],
};
export { event };