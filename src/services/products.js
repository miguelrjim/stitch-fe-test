/**
 * Created by mjimenez on 10/29/16.
 */
import {getApiPath, postApiPath, putApiPath, deleteApiPath} from  '../constants';

export function fetchProducts(page = 1, title, startDate, endDate) {
  let filters = addFilters(title, startDate, endDate);
  return fetch(`${getApiPath}/admin/products.json?page=${page}&fields=title,id${filters ? '&' + filters : ''}`)
    .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
    .then(data => data.products)
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function getProductsCount(title, startDate, endDate) {
  let filters = addFilters(title, startDate, endDate);
  return fetch(`${getApiPath}/admin/products/count.json${filters ? '?' + filters : ''}`)
    .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
    .then(data => data.count)
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function fetchProduct(id) {
  return fetch(`${getApiPath}/admin/products/${id}.json`)
    .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
    .then(data => data.product)
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function updateProduct(id, payload) {
  let headers = new Headers({
    'Content-Type': 'application/json'
  });
  return fetch(`${putApiPath}/admin/products/${id}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      product: {
        ...payload,
        id
      }
    })
  })
    .then(response => response.ok ? Promise.resolve() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function createProduct(title) {
  let headers = new Headers({
    'Content-Type': 'application/json'
  });
  return fetch(`${postApiPath}/admin/products.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      product: {
        title
      }
    })
  })
    .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
    .then(data => data.product)
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
}

export function updateVariant(product, id, payload) {
  let headers = new Headers({
    'Content-Type': 'application/json'
  });
  return fetch(`${putApiPath}/admin/products/${product}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      product: {
        id: parseInt(product),
        variants: payload
      }
    })
  })
    .then(response => response.ok ? Promise.resolve() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
}

export function deleteProduct(id) {
  return fetch(`${deleteApiPath}/admin/products/${id}.json`, {
    method: 'DELETE',
    headers
  })
    .then(response => response.ok ? Promise.resolve() : response.text().then(text => Promise.reject(new Error(`${response.status}: ${text}`))))
}

function addFilters(title, startDate, endDate) {
  let filters = [];
  if(title) filters.push(`title=${title}`);
  if(startDate) filters.push(`startDate=${startDate}`);
  if(endDate) filters.push(`endDate=${endDate}`);
  return filters.join('&');
}