export const ADD_POSTS = 'ADD_POSTS';

export const POST_TYPES = [
  { label: 'Simple Post', type: 'simplePost' },
];

export const POST_TYPES_BY_KEY = POST_TYPES
  .reduce(
    (result, postType) => ({ ...result, [postType.type]: postType }),
    {},
  );

export const SIDEBAR_FILTERS = {
  DATE_RANGE_FILTERS: [
    { label: 'All', value: 'all' },
    { label: 'Last 12 hours', value: 'last12hours' },
    { label: 'Last 24 hours', value: 'last24hours' },
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last month', value: 'lastMonth' },
    { label: 'Custom', value: 'custom' },
  ],

  CONTENT_TYPE_FILTERS: POST_TYPES
    .map(postType => ({
      label: postType.label,
      value: postType.type,
    })),
};
