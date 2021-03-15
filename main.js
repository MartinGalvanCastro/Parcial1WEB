/******************************************************************************
 * VARIABLES
 ******************************************************************************/

/*
 * Items en el carro
 */
let cart = [];

/*
 * Arhcivo JSON
 */
const urlComidas = "./JSON/jsonProducts.JSON";

/**
 * Contenido a cambiar
 */
const contentTitle = document.getElementById("title-content");
const contentContainer = document.getElementById("content-container");
const numberItems = document.getElementById("cart-items");

/**
 * Botones Navbar, obtener cual boton esta clickeado, y carrito de compra
 */
const navButtons = [
  document.getElementById("burgers"),
  document.getElementById("tacos"),
  document.getElementById("salads"),
  document.getElementById("desserts"),
  document.getElementById("drinks"),
];
const cartLink = document.getElementById("cart-link");
const yesCancel = document.getElementById("yes-cancel");

/******************************************************************************
 * FUNCIONES
 ******************************************************************************/

/**
 * Crear objeto
 * @param {} data, datos del producto en el carro
 * @param {*} i, indice en la tabla
 */
function prodTable(data, i) {
  this.item = i + 1;
  this.qty = 1;
  this.description = data.name;
  this.unitPrice = data.price;
  this.amount = () => {
    return this.qty * this.unitPrice;
  };
}

/**
 * Función para el manejo de botones de producto
 * @param {*} botones
 */
const botonProducto = (botones) => {
  arrayBotones = Array.from(botones);
  arrayBotones.forEach((boton) => {
    boton.onclick = () => {
      let data = JSON.parse(boton.getAttribute("data"));
      let newProd = new prodTable(data, cart.length);
      let search = cart.find((item) => {
        return item.description == newProd.description;
      });
      if (!search) {
        cart.push(newProd);
      } else {
        let index = cart.findIndex((item) => {
          return item.description == newProd.description;
        });
        cart[index].qty += 1;
      }
      let cantidad = 0;
      cart.forEach((producto) => {
        cantidad += producto.qty;
      });

      numberItems.innerHTML = cantidad + " Items";
    };
  });
};

/**
 * Manipular lista de clases de los navbuttons
 * @param index indice del boton
 */
const modifyClassList = (indexButton) => {
  if (indexButton !== -1) {
    navButtons[indexButton].classList.add("active");
  }
  navButtons.forEach((button, index) => {
    if (index != indexButton) {
      let listaClases = button.classList;
      if (listaClases.contains("active")) {
        button.classList.remove("active");
      }
    }
  });
};

/**
 * Función para limpiar el contenido de la pagina
 */
const removeChilds = () => {
  while (contentContainer.firstChild) {
    contentContainer.removeChild(contentContainer.firstChild);
  }
};

/**
 * Funcíon para manejar el render de las cartas
 * @param indexMenu, indice del arreglo de menus
 */
const renderCards = (indexMenu) => {
  if (!contentContainer.classList.contains("row-cols-4")) {
    contentContainer.classList.add("row-cols-4");
  }

  if (contentContainer.hasChildNodes()) {
    removeChilds();
  }
  fetch(urlComidas)
    .then((res) => res.json())
    .then((res) => {
      productos = res[indexMenu].products;
      productos.forEach((product) => {
        //Crear la carta
        let col = document.createElement("div");
        col.classList.add("col");
        col.classList.add("mb-4");
        col.classList.add("d-flex");
        let cardProducto = document.createElement("div");
        cardProducto.classList.add("card");
        cardProducto.classList.add("card-producto");

        //Imagen de la carta
        let img = document.createElement("img");
        img.classList.add("card-img");
        img.setAttribute("alt", "Imagen de " + product.name);
        img.setAttribute("src", product.image);
        cardProducto.appendChild(img);

        //Body de la carta
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        //Titulo
        let title = document.createElement("h5");
        title.classList.add("card-title");
        title.innerHTML = product.name;
        cardBody.appendChild(title);

        //Texto
        let text = document.createElement("p");
        text.classList.add("card-text");
        text.innerHTML = product.description;
        cardBody.appendChild(text);

        //Precio y boton
        let cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer");
        cardFooter.classList.add("bg-transparent");
        cardFooter.classList.add("border-0");

        let precio = document.createElement("p");
        let strong = document.createElement("strong");
        strong.innerHTML = product.price + "";
        precio.appendChild(strong);

        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-dark");
        button.classList.add("boton-producto");
        button.setAttribute("type", "button");
        button.setAttribute("data", JSON.stringify(product));
        button.innerHTML = "Add to cart";
        cardFooter.appendChild(precio);
        cardFooter.appendChild(button);

        cardProducto.appendChild(cardBody);
        cardProducto.appendChild(cardFooter);
        col.appendChild(cardProducto);
        contentContainer.appendChild(col);
      });
      let botones = document.getElementsByClassName("boton-producto");
      botonProducto(botones);
    })
    .catch((err) => console.log(err));
};

/**
 * Función para renderizar la tabla
 */
const renderTable = () => {
  removeChilds();
  if (contentContainer.classList.contains("row-cols-4")) {
    contentContainer.classList.remove("row-cols-4");
  }

  //Tabla
  let total = 0;
  let tableHeader = [
    "Item",
    "Qty",
    "Description",
    "Unit Price",
    "Amount",
    "Modify",
  ];
  let table = document.createElement("table");
  let col = document.createElement("div");
  col.classList.add("col-12");
  table.classList.add("table");
  table.classList.add("table-striped");

  //Thead
  let thead = document.createElement("thead");
  let trhead = document.createElement("tr");
  tableHeader.forEach((item) => {
    let th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.innerHTML = item;
    trhead.appendChild(th);
  });
  thead.appendChild(trhead);
  table.appendChild(thead);

  if (cart.length > 0) {
    let tbody = document.createElement("tbody");
    cart.forEach((item) => {
      let row = document.createElement("tr");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.innerHTML = item.item;
      row.appendChild(th);

      let qty = document.createElement("td");
      qty.innerHTML = item.qty;
      row.appendChild(qty);

      let description = document.createElement("td");
      description.innerHTML = item.description;
      row.appendChild(description);

      let unitPrice = document.createElement("td");
      unitPrice.innerHTML = item.unitPrice;
      row.appendChild(unitPrice);

      let amount = document.createElement("td");
      amount.innerHTML = item.amount();
      row.appendChild(amount);
      total += item.amount();

      let modify = document.createElement("td");
      let plusButton = document.createElement("button");
      plusButton.classList.add("btn");
      plusButton.classList.add("btn-dark");
      plusButton.classList.add("mr-1");
      plusButton.innerHTML = "+";
      let minusButton = document.createElement("button");
      minusButton.classList.add("btn");
      minusButton.classList.add("btn-dark");
      minusButton.innerHTML = "-";
      modify.appendChild(plusButton);
      modify.appendChild(minusButton);

      plusButton.onclick = () => {
        item.qty += 1;
        renderTable(totalProd);
      };

      minusButton.onclick = () => {
        item.qty -= 1;
        if (item.qty === 0) {
          let index = cart.findIndex((itemSearch) => {
            return item.description == itemSearch.description;
          });
          cart.splice(index, 1);
        }
        renderTable(totalProd);
      };
      row.appendChild(modify);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  }

  col.appendChild(table);
  contentContainer.appendChild(col);

  let tableFooter = document.createElement("div");
  tableFooter.classList.add("row");
  tableFooter.classList.add("justify-content-between");

  let colTotal = document.createElement("div");
  colTotal.classList.add("col-2");
  let p = document.createElement("p");
  let strong = document.createElement("strong");
  strong.innerHTML = "Total: $" + total;
  p.appendChild(strong);
  colTotal.appendChild(p);
  tableFooter.appendChild(colTotal);

  let colButton = document.createElement("div");
  colButton.classList.add("col-3");
  let confirm = document.createElement("button");
  let cancel = document.createElement("button");
  confirm.classList.add("btn");
  confirm.classList.add("btn-light");
  confirm.classList.add("border");
  confirm.classList.add("border-dark");
  confirm.classList.add("ml-1");
  confirm.innerHTML = "Confirm order";
  cancel.classList.add("btn");
  cancel.classList.add("btn-danger");
  cancel.classList.add("border");
  cancel.classList.add("border-dark");
  cancel.setAttribute("data-toggle", "modal");
  cancel.setAttribute("data-target", "#cancelModal");
  cancel.innerHTML = "Cancel";
  colButton.appendChild(cancel);
  colButton.appendChild(confirm);
  tableFooter.appendChild(colButton);

  confirm.onclick = () => {
    if (cart.length > 0) {
      let finalCart = [];
      cart.forEach((item) => {
        finalCart.push({
          item: item.item,
          quantity: item.qty,
          description: item.description,
          unitPrice: item.unitPrice,
        });
      });
      console.log(finalCart);
    } else {
      console.log("No products added. Plase add products");
    }
  };
  contentContainer.appendChild(tableFooter);
  let totalProd = 0;
  cart.forEach((item) => {
    totalProd += item.qty;
  });
  numberItems.innerHTML = totalProd + " Items";
};

/**
 * Función para cancelar el pedido
 */
yesCancel.onclick = () => {
  cart = [];
  renderTable();
};

/******************************************************************************
 * NAVEGACIÓN
 ******************************************************************************/
navButtons[0].onclick = () => {
  contentTitle.innerHTML = "Burgers";
  renderCards(0);
  modifyClassList(0);
};
navButtons[1].onclick = () => {
  contentTitle.innerHTML = "Tacos";
  renderCards(1);
  modifyClassList(1);
};
navButtons[2].onclick = () => {
  contentTitle.innerHTML = "Salads";
  renderCards(2);
  modifyClassList(2);
};
navButtons[3].onclick = () => {
  contentTitle.innerHTML = "Desserts";
  renderCards(3);
  modifyClassList(3);
};
navButtons[4].onclick = () => {
  contentTitle.innerHTML = "Drinks";
  renderCards(4);
  modifyClassList(4);
};
cartLink.onclick = () => {
  contentTitle.innerHTML = "Order Details";
  modifyClassList(-1);
  removeChilds();
  renderTable();
};
