
function graphicsCard({ key, urlPath, sku, description, price, brandLogo }) {
  const template = `
    <div class="card">
      <div class="card-top">
        <div class="product-image">
          <button id="edit" class="edit" data-key="${key}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button id="delete" class="delete" data-key="${key}">
            <i class="bi bi-trash"></i>
          </button>
          <img src="${urlPath}" alt="graphical processing unit">
        </div>
        <div class="product-properties">
          <div class="flex">
            <img src="${brandLogo}" alt="brand logo">
            <p class="sku">${sku}</p>
          </div>
          <p class="product-description">${description.substring(0, 75)}</p>
        </div>
      </div>
      <div class="product-price">
        <p class="price">$${price} CAD</p>
        <button id="buy" class="buy" data-key="${key}">
          Buy Now
        </button>
      </div>
    </div>
    `;
  const element = document.createRange().createContextualFragment(template)
    .children[0];
  addProductControls(element);
  return element;
}

function addProductControls(product) {
  product.querySelector("#edit").addEventListener("click", onEditProduct);
  product.querySelector("#delete").addEventListener("click", onRemoveProduct);
}

function onEditProduct(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("update.html");
}

function onRemoveProduct(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("delete.html");
}

export { graphicsCard };