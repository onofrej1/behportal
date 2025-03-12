import { TableData } from "@/types/resources";
import { Resource } from '@/types/resources';
import { CreateRun } from "@/validation";

const run: Resource = {
  name: 'Run',
  name_plural: 'Runs',
  model: 'run',
  resource: 'runs',
  relations: ['event'],
  rules: CreateRun,
  menuIcon: '',
  group: 'Manage runs',
  filter: [],
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
      resource: 'event',
      renderLabel: (row) => row.name,
    },
    {
      name: 'runCategories', 
      type: 'manyToMany',
      label: 'Categories',
      resource: 'runCategory',
      renderLabel: (row) => row.category,
    }  
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'event', header: 'Event', render: (row: TableData) => <span>{row.event.name}</span> },
    { name: 'title', header: 'Title' },
    { name: 'distance', header: 'Distance', render: (row: TableData) => <span>{row.distance} km</span> },
  ],
};
export { run };