import { get } from './apiCore';

export async function getPosts({
  page, perPage, start, end, type,
} = {}) {
  const queryParams = {
    page,
    per_page: perPage,
    start: start || undefined,
    end: end || undefined,
    type,
  };

  return get('/v1/posts', queryParams);
}
