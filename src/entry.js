/**
 * Created by mjimenez on 10/29/16.
 */
"use strict";
import 'jquery';
import angular from 'angular';
import angularUIRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';
import appComponent from './components/app';
import productsComponent from './components/products';
import productComponent from './components/product';
import editableDirective from './directives/editable';
import {getProductsCount} from './services/products';
import rootReducer from './reducers';
import createLogger from 'redux-logger';
import {filterProducts, getProduct} from './actions/products';
import {setAppState} from './actions/app';
import './main.scss';
import 'font-awesome-webpack';

export default angular.module('Shopify', [angularUIRouter, ngRedux])
  .config($ngReduxProvider => {
    $ngReduxProvider.createStoreWith(rootReducer, [thunk, createLogger()]);
  })
  .config(($urlRouterProvider, $stateProvider) => {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state({
      name: 'app',
      url: '/',
      redirectTo: 'products',
      component: 'app'
    })
    $stateProvider.state({
      parent: 'app',
      name: 'products',
      url: 'products',
      component: 'products',
      resolve: {
        _productsCount: ($ngRedux) => getProductsCount().then(count => $ngRedux.dispatch(setAppState({
          total: count,
          pages: Math.ceil(count/$ngRedux.getState().app.size)
        })))
          .then(() => {
            $ngRedux.dispatch(filterProducts())
          })
      }
    });
    $stateProvider.state({
      parent: 'products',
      name: 'product',
      url: '/{id}',
      component: 'product',
      resolve: {
        id: ($stateParams, $ngRedux) => $ngRedux.dispatch(getProduct($stateParams.id))
      }
    })
  })
  .component('products', productsComponent)
  .component('app', appComponent)
  .component('product', productComponent)
  .directive('editable', editableDirective)
  .name;