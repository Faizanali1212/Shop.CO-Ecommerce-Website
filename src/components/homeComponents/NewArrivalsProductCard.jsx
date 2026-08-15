import React from 'react'

function NewArrivalsProductCard({product}) {
  return (
       <div>
      <h1>{product.name}</h1>
      <h1>{product.price}</h1>
      <h1>{product.description}</h1>
      <img src={product.image} alt={product.name} />

    </div>
  )
}

export default NewArrivalsProductCard ;

