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
