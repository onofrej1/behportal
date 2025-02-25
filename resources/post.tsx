import { TableData } from '@/components/table/table';
import { Resource } from '@/resources/resources.types';

const post: Resource = {
  name: 'Post',
  name_plural: 'Posts',
  model: 'post',
  resource: 'posts',
  rules: 'CreateOrEditPost',
  group: 'Blog',
  menuIcon: '',
  filter: [
    { name: 'title', type: 'text', label: 'Title' },    
    { name: 'categories', search: 'categories_some_id', type: 'select-filter', textField: 'id', label: 'Category' },
    /*{ name: 'authorId', type: 'select-filter', textField: 'lastName', className: 'w-60', label: 'Author'},*/
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'content', type: 'richtext', label: 'Content' },
    { name: 'status', type: 'text', label: 'Status' },
    { name: 'cover', type: 'fileUpload', label: 'Cover'/*, uploadPath: 'posts'*/ },
    {
      name: 'authorId', 
      type: 'fk',
      relation: 'author',
      label: 'Author',
      resource: 'user',
      renderLabel: (row: any) => `${row.lastName} ${row.firstName}`,
    },
    {
      name: 'categories', 
      type: 'm2m',
      label: 'Categories',
      resource: 'category',
      textField: 'title'
    },
    {
      name: 'tags', 
      type: 'm2m',
      label: 'Tags',
      resource: 'tag',
      textField: 'title'
    }
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'title', header: 'Title' },
    { name: 'cover', header: 'Cover' },
    { name: 'status', header: 'Status' },
    { name: 'authorId', header: 'AuthorId' },
    { name: 'categories', header: 'Categories', render: (row: TableData) => <span>{row.categories.map((c: any) => c.id).join(',')}</span> },
    /*{ 
      name: 'content', 
      header: 'Content', 
    },*/
  ],
};
export { post };