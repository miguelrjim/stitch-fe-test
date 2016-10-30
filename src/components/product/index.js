/**
 * Created by mjimenez on 10/29/16.
 */
import template from './index.html';
import autobind from 'autobind-decorator';
import {editProduct, editVariant} from '../../actions/products';

class ProductController {
  constructor($scope, $ngRedux) {
    const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {
      editProduct,
      editVariant
    })(this);
    $scope.$on('$destroy', unsubscribe);
    this.parseInt = window.parseInt;
  }

  mapStateToThis(state) {
    let product = state.products[this.id];
    return {
      title: product.title,
      stock: product.variants.reduce((total, variant) => total + variant.inventory_quantity, 0),
      variants: product.variants
    }
  }
  
  @autobind
  updateProp(prop, value) {
    this.editProduct(this.id, {
      [prop]: value
    })
  }

  @autobind
  updateVariantProp(id, prop, value) {
    this.editVariant(this.id, id, {
      [prop]: value
    })
  }
}

export default {
  template,
  controller: ProductController,
  bindings: {
    id: '<'
  }
}