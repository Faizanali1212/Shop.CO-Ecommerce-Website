import React from 'react'

function TopSellingProductCard({product}) {
  return (
    <div>
      <h1>{product.productName}</h1>
      <h1>{product.productPrice}</h1>
      {/* <h1>{product.description}</h1> */}
      <img src={product.productImage} alt={product.name} />
    </div>
  )
}

export default TopSellingProductCard;
