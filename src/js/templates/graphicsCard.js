
function graphicsCard({ key, city, urlPath }) {
  const template = `
    <div class="card">
      <img src="./assets/images/EVGA-3080.png" alt="graphical processing unit">
      <div class="product-properties">
        <h2 class="title">EVGA 3080</h2>
        <p class="price">$1979.99</p>
        <p class="sku">GG12345</p>
        <img src="./assets/images/rating.svg" alt="product rating">
      </div>
    </div>
    `;
  const element = document.createRange().createContextualFragment(template)
    .children[0];
  addRentalControls(element);
  return element;
}

function addRentalControls(rental) {
  rental.querySelector("#edit").addEventListener("click", onEditRental);
  rental.querySelector("#delete").addEventListener("click", onRemoveRental);
}

function onEditRental(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("update.html");
}

function onRemoveRental(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("delete.html");
}
export { graphicsCard };
