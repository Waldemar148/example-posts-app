import * as queryString from 'query-string';
import { fromJS } from 'immutable';

const BASE_URL = 'api.posts.com';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const request = (path, config) => fetch(`${BASE_URL}${path}`, config);

export async function get(path, queryParams = {}) {
  const qry = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
  const response = await request(`${path}${qry ? '?' : ''}${qry}`, {
    method: 'GET',
  });

  return response && fromJS(await response.json());
}

export async function post(path, content) {
  const response = await request(path, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(content),
  });

  return response && fromJS(await response.json());
}

export async function put(path, content) {
  const response = await request(path, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(content),
  });

  return response && fromJS(await response.json());
}

export async function patch(path, content) {
  const response = await request(path, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(content),
  });

  return response && fromJS(await response.json());
}

export async function del(path) {
  const response = await request(path, {
    method: 'DELETE',
    headers: JSON_HEADERS,
  });

  return response && fromJS(await response.json());
}
