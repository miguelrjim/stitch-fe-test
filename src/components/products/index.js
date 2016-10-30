/**
 * Created by mjimenez on 10/29/16.
 */
import template from './index.html';
import autobind from 'autobind-decorator';
import './index.scss';
import {addProduct, removeProduct} from '../../actions/products';

class ProductsController {
  constructor($scope, $state, $ngRedux) {
    this.$state = $state;
    const unsubscribe = $ngRedux.connect(this.mapStateToThis, {
      addProduct,
      removeProduct
    })(this)
    $scope.$on('$destroy', unsubscribe);
  }

  mapStateToThis(state) {
    return {
      products: state.app.currentProducts.map(id => state.products[id]),
      pages: (() => {
        let pages = [];
        for(let i=1;i<=state.app.pages;i++) pages.push(i);
        return pages;
      })(),
      totalPages: state.app.pages,
      page: state.app.page,
      newProduct: state.app.newProduct
    }
  }

  @autobind
  loadProduct(id) {
    let {$state} = this;
    $state.go('product', {
      id
    });
  }

  @autobind
  addNew(title) {
    let {$state} = this;
    this.addProduct(title)
      .then(id => {
        $state.go('product', {
          id
        });
      });
  }

  @autobind
  deleteProduct(id) {
    this.removeProduct(id);
  }
}

export default {
  template,
  controller: ProductsController
}