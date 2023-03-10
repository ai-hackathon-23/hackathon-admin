import { stringify } from "query-string";
import { fetchUtils, DataProvider } from "ra-core";
import { headers } from "next/headers";

/**
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */

const contentType = "Content-Type";
const xFormUrlEncoded = "x-www-form-urlencoded";
// const countHeader = 'Content-Range'

const defaultHeaders = (): Headers => {
  // set headers
  let headers = new Headers({});

  headers.set("Content-Type", "application/x-www-form-urlencoded");
  return headers;
};
const getSearchParams = (data: any) => {
  const bodyParams = new URLSearchParams();

  Object.keys(data).forEach((key) => bodyParams.append(key, data[key]));

  return bodyParams;
};

export const restDataProvider = (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson,
  countHeader: string = "Content-Range"
): DataProvider => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const rangeStart = (page - 1) * perPage;
    const rangeEnd = page * perPage - 1;

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([rangeStart, rangeEnd]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    let options = {
      headers: defaultHeaders(),
    };

    return httpClient(url, options).then(({ headers, json }) => {
      if (!headers.has(countHeader)) {
        throw new Error(
          `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
        );
      }
      return {
        data: json,
        total: json.length,
      };
    });
  },

  getOne: (resource, params) => {
    let options = {
      headers: defaultHeaders(),
    };
    return httpClient(`${apiUrl}/${resource}/${params.id}`, options).then(
      ({ json }) => ({
        data: json,
      })
    );
  },

  getMany: (resource, params) => {
    let options = {
      headers: defaultHeaders(),
    };
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url, options).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    let options = {
      headers: defaultHeaders(),
    };

    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const rangeStart = (page - 1) * perPage;
    const rangeEnd = page * perPage - 1;

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    // const options =
    //     countHeader === 'Content-Range'
    //         ? {
    //             // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
    //             headers: new Headers({
    //                 Range: `${resource}=${rangeStart}-${rangeEnd}`,
    //             }),
    //         }
    //         : {};

    return httpClient(url, options).then(({ headers, json }) => {
      if (!headers.has(countHeader)) {
        throw new Error(
          `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
        );
      }
      return {
        data: json,
        total:
          countHeader === "Content-Range"
            ? parseInt(headers.get("content-range").split("/").pop(), 10)
            : parseInt(headers.get(countHeader.toLowerCase())),
      };
    });
  },

  update: (resource, params) => {
    const bodyParams = new URLSearchParams();
    const data = params.data;
    Object.keys(data).forEach((key) => bodyParams.append(key, data[key]));

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: bodyParams,
      headers: defaultHeaders(),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: (resource, params) => {
    const bodyParams = new URLSearchParams();
    const data = params.data;
    Object.keys(data).forEach((key) => bodyParams.append(key, data[key]));

    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: bodyParams,
          headers: defaultHeaders(),
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) }));
  },

  create: (resource, params) => {
    const bodyParams = new URLSearchParams();
    const data = params.data;
    Object.keys(data).forEach((key) => bodyParams.append(key, data[key]));

    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: bodyParams,
      headers: defaultHeaders(),
    }).then(({ json }) => ({ data: json }));
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
      headers: defaultHeaders(),
    }).then(({ json }) => ({ data: json })),

  // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
          headers: defaultHeaders(),
        })
      )
    ).then((responses) => ({
      data: responses.map(({ json }) => json.id),
    })),
});
