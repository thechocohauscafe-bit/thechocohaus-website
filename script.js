// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", function () {
    navigation.classList.toggle("active");
  });
}

// MENU CATEGORY FILTER

const categoryButtons = document.querySelectorAll(".category-btn");
const menuCategories = document.querySelectorAll(".menu-category");

categoryButtons.forEach(button => {

  button.addEventListener("click", () => {

    const selectedCategory = button.dataset.category;

    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    menuCategories.forEach(section => {

      if (
        selectedCategory === "all" ||
        section.dataset.section === selectedCategory
      ) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }

    });

  });

});


// SHOPPING CART

let cart = JSON.parse(localStorage.getItem("chocohausCart")) || [];

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {

  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    localStorage.setItem(
      "chocohausCart",
      JSON.stringify(cart)
    );

    button.textContent = "Added ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.textContent = "+ Add";
      button.classList.remove("added");
    }, 900);

    updateCartBar();

  });

});


function updateCartBar() {

  const floatingCart = document.getElementById("floatingCart");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!floatingCart || !cartCount || !cartTotal) {
    return;
  }

  const quantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  if (quantity > 0) {
    floatingCart.classList.add("visible");
  } else {
    floatingCart.classList.remove("visible");
  }

  cartCount.textContent =
    quantity === 1
      ? "1 item"
      : `${quantity} items`;

  cartTotal.textContent = `Rs ${total}`;
}


updateCartBar();

/* ==================================
   ORDER PAGE
================================== */

const orderItemsContainer = document.getElementById("orderItems");
const emptyCart = document.getElementById("emptyCart");
const orderTotals = document.getElementById("orderTotals");
const checkoutBox = document.getElementById("checkoutBox");

function getCart() {
  return JSON.parse(localStorage.getItem("chocohausCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("chocohausCart", JSON.stringify(cart));
}

function renderOrderPage() {

  if (!orderItemsContainer) return;

  let orderCart = getCart();

  orderItemsContainer.innerHTML = "";

  if (orderCart.length === 0) {

    emptyCart.style.display = "block";
    orderTotals.style.display = "none";

    if (checkoutBox) {
      checkoutBox.style.display = "none";
    }

    return;
  }

  emptyCart.style.display = "none";
  orderTotals.style.display = "block";

  if (checkoutBox) {
    checkoutBox.style.display = "block";
  }

  let subtotalAmount = 0;

  orderCart.forEach((item, index) => {

    subtotalAmount += item.price * item.quantity;

    const product = document.createElement("div");

    product.className = "order-product";

    product.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <div class="order-product-price">
          Rs ${item.price} each
        </div>
      </div>

      <div class="order-product-right">

        <strong>
          Rs ${item.price * item.quantity}
        </strong>

        <div class="quantity-control">

          <button
            type="button"
            onclick="changeQuantity(${index}, -1)">
            −
          </button>

          <span>${item.quantity}</span>

          <button
            type="button"
            onclick="changeQuantity(${index}, 1)">
            +
          </button>

        </div>

        <button
          type="button"
          class="remove-item"
          onclick="removeOrderItem(${index})">
          Remove
        </button>

      </div>
    `;

    orderItemsContainer.appendChild(product);

  });


  document.getElementById("subtotal").textContent =
    `Rs ${subtotalAmount}`;

  document.getElementById("grandTotal").textContent =
    `Rs ${subtotalAmount}`;
}


window.changeQuantity = function(index, amount) {

  let orderCart = getCart();

  orderCart[index].quantity += amount;

  if (orderCart[index].quantity <= 0) {
    orderCart.splice(index, 1);
  }

  saveCart(orderCart);

  renderOrderPage();

};


window.removeOrderItem = function(index) {

  let orderCart = getCart();

  orderCart.splice(index, 1);

  saveCart(orderCart);

  renderOrderPage();

};


renderOrderPage();


/* PICKUP / DELIVERY */

const orderTypeInputs =
  document.querySelectorAll('input[name="orderType"]');

const deliveryFields =
  document.getElementById("deliveryFields");

orderTypeInputs.forEach(input => {

  input.addEventListener("change", function() {

    if (this.value === "Delivery") {
      deliveryFields.style.display = "block";
    } else {
      deliveryFields.style.display = "none";
    }

  });

});


/* WHATSAPP ORDER */

const placeOrderBtn =
  document.getElementById("placeOrderBtn");

if (placeOrderBtn) {

  placeOrderBtn.addEventListener("click", function() {

    const orderCart = getCart();

    const name =
      document.getElementById("customerName").value.trim();

    const phone =
      document.getElementById("customerPhone").value.trim();

    const address =
      document.getElementById("customerAddress").value.trim();

    const note =
      document.getElementById("orderNote").value.trim();

    const orderType =
      document.querySelector(
        'input[name="orderType"]:checked'
      ).value;

    const error =
      document.getElementById("orderError");


    if (orderCart.length === 0) {
      error.textContent = "Your order is empty.";
      return;
    }


    if (!name || !phone) {
      error.textContent =
        "Please enter your name and phone number.";
      return;
    }


    if (orderType === "Delivery" && !address) {
      error.textContent =
        "Please enter your delivery address.";
      return;
    }


    error.textContent = "";


    let total = 0;

    let message =
`🍫 THE CHOCOHAUS CAFE

NEW ORDER

Customer: ${name}
Phone: ${phone}
Order Type: ${orderType}

--------------------
ORDER
--------------------
`;


    orderCart.forEach(item => {

      const itemTotal =
        item.price * item.quantity;

      total += itemTotal;

      message +=
`${item.quantity} × ${item.name}
Rs ${itemTotal}

`;

    });


    message +=
`--------------------
TOTAL: Rs ${total}
--------------------
`;


    if (orderType === "Delivery") {
      message +=
`
Delivery Address:
${address}
`;
    }


    if (note) {
      message +=
`
Special Instructions:
${note}
`;
    }


    message +=
`
Thank you!`;


    const cafeWhatsApp = "9779713528819";

    const whatsappURL =
      `https://wa.me/${cafeWhatsApp}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

  });

}
