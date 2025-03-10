import { Resource } from '@/types/resources';

const tag: Resource = {
    name: 'Tag',
    name_plural: 'Tags',
    model: 'tag',
    resource: 'tags',
    group: 'Blog',
    filter: [],
    menuIcon: '',
    rules: 'CreateTag',    
    form: [
        { name: 'title', type: 'text', label: 'Title' },
    ],
    list: [
        { name: 'id', header: 'Id' },
        { name: 'title', header: 'Title' },
    ],
};
export { tag };