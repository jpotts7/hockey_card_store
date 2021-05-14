// Make sure the page loads before the event listeners are applied.
if (document.readyState == "loading") {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

//Great! Now that the page has loaded, the event listeners can be applied.
function ready() {
  // When the remove button is clicked, it will delete the entire item row from the cart.
  const removeCartItemButtons = document.querySelectorAll(".btn-danger");
  const removeButtonArray = Array.from(removeCartItemButtons);
  removeButtonArray.map((button) => {
    button.addEventListener('click', removeCartItem);
  })

  // Checking to see if there is a change to the quantity input
  const quantityInputs = document.querySelectorAll(".cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    const input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  // Adding an event listeners to the "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".shop-item-button");
  for (let i = 0; i < addToCartButtons.length; i++) {
    const button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  // When the purchase button is clicked, all the cart items are removed and total is reset.
  document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
}

// Selects all the info from each shop item and displays it as a new row in the shopping cart.
function addToCartClicked(event) {
  const button = event.target;
  const shopItem = button.parentElement.parentElement;
  const title = shopItem.querySelector(".shop-item-title").innerText;
  const price = shopItem.querySelector(".shop-item-price").innerText;
  const imgSrc = shopItem.querySelector(".shop-item-image").src;
  addItemToCart(title, price, imgSrc);
  updateCartTotal();
}

//Adding items to the cart once clicked.
function addItemToCart(title, price, imgSrc) {
//First, create a new div element to be populated and add the necessary class for styling.
  const cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');
  const cartItems = document.querySelector('.cart-items');
  const cartItemNames = document.querySelectorAll('.cart-item-title');
  //Check to see if the item already exists and if so, alert the user.
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already in your shopping cart!");
      return
    } 
  }
  //If the item doesn't exist, we fill the div element with the cart item HTML and append it to the cart row.
  const cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src=${imgSrc} width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  //Adds the event listeners to the remove button and inputs of new items
  cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
  cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
}

//When the purchase button is clicked, cart is reset.
function purchaseClicked() {
  alert('Thank you for your purchase!');
  const cartItems = document.querySelector('.cart-items');
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}

// A function that removes the entire item row. Included in the 'ready' function.
function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

// Checking to make sure the quantity values aren't negative, not a number, or zero and makes the default quantity '1'.
function quantityChanged(event) {
  const input = event.target;
  if(isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

// Updates the shopping cart total, based on type and quantity of item.
function updateCartTotal() {
  const cartItemContainer = document.querySelector(".cart-items");
  const cartRows = cartItemContainer.querySelectorAll(".cart-row");
  let total = 0;

  for (let i = 0; i < cartRows.length; i++) {
    const cartRow = cartRows[i];
    const priceElement = cartRow.querySelector(".cart-price");
    const quantityElement = cartRow.querySelector(".cart-quantity-input");
    const price = parseFloat(priceElement.innerText.replace("$", ""));
    const quantity = quantityElement.value;
    total = total + (price * quantity);
  }
  //Make the price show only two decimal places.
  total = Math.round(total * 100) / 100
  document.querySelector(".cart-total-price").innerText = "$" + total;
}