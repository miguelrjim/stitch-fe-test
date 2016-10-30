/**
 * Created by mjimenez on 10/30/16.
 */
import moment from 'moment';
import {fetchProducts, getProductsCount, fetchProduct, updateProduct, updateVariant, createProduct, deleteProduct} from '../services/products';
import {setAppState} from './app';
import {setFilterState} from './filter';

export const ADD_PRODUCTS = 'ADD_PRODUCTS';
export function addProducts(products) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      let newProducts = products.filter(product => !state.products[product.id]).length;
      dispatch({
        type: ADD_PRODUCTS,
        products
      });
      dispatch(setAppState({
        fetched: state.app.fetched + newProducts
      }));
      resolve(products);
    })
  }
}

export const ADD_PRODUCT = 'ADD_PRODUCT';
export function addProduct(title) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      createProduct(title)
        .then(product => {
          dispatch(setAppState({
            total: state.app.total + 1,
            newProduct: ''
          }))
          return dispatch(addProducts([{
            ...product,
            fetched: true
          }]))
        })
        .then(products =>  {
          dispatch(filterProducts());
          resolve(products[0].id);
        });
    })
  }
}

export const GET_PRODUCT = 'GET_PRODUCT';
export function getProduct(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      let prom;
      if(state.products[id].fetched) {
        prom = Promise.resolve(id);
      }
      else {
        prom = fetchProduct(id)
          .then(product => {
            dispatch(editProduct(id, {
              ...product,
              fetched: true
            }, false)), reject
            return id;
          });
      }
      prom.then(resolve, reject);
    })
  }
}


export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export function removeProduct(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      deleteProduct(id)
        .then(() => {
          dispatch({
            type: REMOVE_PRODUCT,
            id
          });
          resolve();
        }, reject);
    });
  }
}

export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export function editProduct(id, payload, put = true) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let prom = put ? updateProduct(id, payload) : Promise.resolve();
      prom.then(() => {
        dispatch({
          type: EDIT_PRODUCT,
          id,
          payload
        });
        resolve();
      });
    });
  }
}

export const EDIT_VARIANT = 'EDIT_VARIANT';
export function editVariant(product, id, payload) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      let productObj = state.products[product];
      let putPayload = productObj.variants.map(variant => variant.id != id ? {
        id: variant.id
      } : {
        ...payload,
        id
      });
      updateVariant(product, id, putPayload)
        .then(() => {
          dispatch({
            type: EDIT_VARIANT,
            product,
            id,
            payload
          });
          resolve();
        });
    });
  }
}

export const GET_PAGE = 'GET_PAGE';
export function getPage(page = 1) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      let prom;
      if(page * state.app.size <= state.app.currentFetched || state.app.currentFetched == state.app.currentTotal) {
        prom = Promise.resolve(state.app.currentProducts);
      }
      else {
        prom = fetchProducts(page, state.filter.title, state.filter.startDate, state.filter.endDate)
          .then(products => dispatch(addProducts(products)).then(products => {
            let currentProducts = state.app.currentProducts.concat(products.map(product => product.id));
            dispatch(setAppState({
              currentProducts: state.app.currentProducts.concat(products.map(product => product.id)),
              currentFetched: state.app.currentFetched + products.length
            }));
            return currentProducts;
          }), reject)
      }
      prom.then(products => {
        let begin = (page-1)*state.app.size;
        return products.slice(begin, begin+state.app.size);
      })
        .then(products => {
        dispatch(setAppState({
          shownProducts: products,
          page
        }));
        resolve();
      }, reject);
    });
  }
}

export const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
export function filterProducts(title, startDate, endDate) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let state = getState();
      let shouldFetch = state.app.fetched === 0 || (state.app.fetched !== state.app.total && (!!title || !!startDate || !!endDate));
      let currentProducts;
      let currentFetched;
      if(!shouldFetch) {
        let filteredProducts = Object.keys(state.products).map(id => state.products[id]);
        if(title) {
          filteredProducts = filteredProducts.filter(product => product.title.indexOf(title) !== -1);
        }
        if(startDate) {
          startDate = moment(startDate);
          filteredProducts = filteredProducts.filter(product => startDate.isBefore(product.created_at));
        }
        if(endDate) {
          endDate = moment(endDate);
          filteredProducts = filteredProducts.filter(product => endDate.isAfter(product.created_at));
        }
        currentProducts = filteredProducts.map(product => product.id);
        currentFetched = currentProducts.length;
      }
      else {
        currentFetched = 0;
        currentProducts = [];
      }
      dispatch(setAppState({
        currentFetched,
        currentProducts
      }));
      let prom;
      if(!shouldFetch) {
        prom = Promise.resolve(currentFetched);
      }
      else {
        prom = getProductsCount(title, startDate, endDate);
      }
      prom.then(total => dispatch(setAppState({
        currentTotal: total,
        pages: Math.ceil(total / state.app.size)
      })))
        .then(() => dispatch(getPage()))
        .then(resolve, reject);
    });
  }
}