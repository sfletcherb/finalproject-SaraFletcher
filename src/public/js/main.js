const socket = io();

console.log("Connected to socket");

socket.emit("greeting", "Hello, connected from main.js");

// Script for add product to cart in products view

document.addEventListener("DOMContentLoaded", async function () {
  let cartId = null; // save id of cart

  try {
    // Make a GET request to retrieve the customer's cart.
    const getCartResponse = await fetch("/api/users/current");

    if (getCartResponse.ok) {
      // Extract the cart ID if it exists
      const cartData = await getCartResponse.json();

      if (cartData?.cart) {
        cartId = cartData.cart;
      }
    } else {
      console.error("Error retrieving the customer's cart.");
    }
  } catch (error) {
    console.error("Error communicating with the server:", error);
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const productId = button.getAttribute("data-product-id");
      const roleType = button.getAttribute("data-product-role");
      const quantityInput = document.querySelector(
        `.quantity-input[data-product-id="${productId}"]`
      );
      const quantity = parseInt(quantityInput.value, 10);
      const messageElement = this.nextElementSibling;

      if (roleType !== "user") {
        console.log("Access denied");
        button.disabled = true;
        messageElement.style.display = "inline";
        return;
      }

      try {
        if (!cartId) {
          console.log("User's cart not found");
          return;
        }

        // Utilize the existing cart ID in the request to add the product
        const response = await fetch(
          `/api/carts/${cartId}/product/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: quantity }),
          }
        );

        if (response.ok) {
          console.log("Product added successfully");
        } else {
          console.error("Error adding product");
        }
      } catch (error) {
        console.error("Error communicating with the server:", error);
      }
    });
  });
});
const updateProductList = (data) => {
  const listProducts = document.getElementById("list-products");
  listProducts.innerHTML = "";
  const roleType = listProducts.getAttribute("data-product-role");
  console.log("roletypemain", roleType);

  data.forEach((product) => {
    listProducts.innerHTML += `<div class="card">
    <div class="card-body">
      <p><strong>id: </strong>${product._id}</p>
      <p><strong>Nombre: </strong>${product.title} </p>
      <p><strong>Descripción: </strong>${product.description} </p>
      <p><strong>Precio: </strong>${product.price} </p>
      <p><strong>Código: </strong>${product.code} </p>
      <p><strong>Stock: </strong>${product.stock} </p>
      <a href="#" class="btn btn-card" data-product-owner="${product.owner}">Eliminar</a>
    </div>
  </div>`;
  });
  // Add event click to the container to identify the id of the product to be deleted
  document.querySelectorAll(".btn-card").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const productOwner =
        event.currentTarget.getAttribute("data-product-owner");

      if (roleType === "premium" && productOwner !== "premium") {
        alert("You are not allowed to delete products owned by admin");
        return;
      }

      const productId = card
        .querySelector("p")
        .textContent.split(":")[1]
        .trim();
      socket.emit("deleteProduct", productId);
    });
  });
  // Add event Listeners to send form data to server
  const productForm = document.getElementById("product-Form");
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(productForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log("Datos a enviar:", data);
    socket.emit("addProduct", data);
  });
};

function showForm(formId) {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.add("hidden");
  document.getElementById(formId).classList.remove("hidden");
}

function deleteUser(userId) {
  if (confirm("¿Are you sure you want delete the user?")) {
    fetch(`/api/users/deleteUser/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting user");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          document.getElementById(`user-row-${userId}`).remove();
        } else {
          alert("Error deleting user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error deleting user");
      });
  }
}

// Get data by socket
socket.on("updateProductList", updateProductList);
// init Chat
