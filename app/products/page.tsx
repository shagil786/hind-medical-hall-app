import { ProductsController } from '@/modules/ui/products/controllers/ProductsController'
import ProductsView from '@/modules/ui/products/view/ProductsView'
import React from 'react'

const Products = () => {
  return (
    <ProductsController>
        <ProductsView />
    </ProductsController>
  )
}

export default Products
