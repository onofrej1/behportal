import { Resource } from '@/types/resources';
import { CreateRun } from "@/validation";
import { Event } from '@prisma/client';

const run: Resource = {
  name: 'Run',
  name_plural: 'Runs',
  model: 'run',
  resource: 'runs',
  relations: ['event', 'runCategories'],
  rules: CreateRun,
  menuIcon: '',
  filter: [
    { name: "title", type: "text", label: "Title" },
    {
      type: "multi-select",
      name: "event",
      label: "Event",
      resource: "events",
      renderOption: (row: Event) => row.name,
      search: "event",
    },
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'distance', type: 'number', label: 'Distance' },
    { name: 'price', type: 'number', label: 'Price [eur]' },    
    { name: 'elevation', type: 'text', label: 'Elevation' },
    { name: 'surface', type: 'text', label: 'Surface' },
    {
      name: 'eventId', 
      type: 'foreignKey',
      relation: 'event',
      label: 'Event',
      resource: 'events',
      renderLabel: (row) => row.name,
    },
    {
      name: 'runCategories', 
      type: 'manyToMany',
      label: 'Categories',
      resource: 'runCategories',
      renderLabel: (row) => `${row.category} - ${row.title}`,
    }  
  ],
  list: [
    { name: 'event', header: 'Event', render: ({ row }) => <span>{row.event.name}</span> },
    { name: 'title', header: 'Title' },
    { name: 'distance', header: 'Distance', render: ({ row }) => <span>{row.distance} m</span> },
  ],
};
export { run };