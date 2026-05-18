const ProductCard = ({ product }) => {

  return (
    <div className="card">

      <img
        src={product.imageUrls?.[0]}
        alt={product.name}
        style={{
          width: "200px",
          height: "200px",
          objectFit: "cover"
        }}
      />

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <h4>₹ {product.price}</h4>

    </div>
  );
};

export default ProductCard;