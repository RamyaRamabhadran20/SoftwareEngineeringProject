let cart = [];

function addToCart(product) {
  cart.push(product);
  console.log("added");
}

function removeFromCart(index) {
  cart.splice(index, 1);
}

function clearCart() {
  cart = [];
}

function getCart() {
  return cart;
}

export { addToCart, removeFromCart, clearCart, getCart };
