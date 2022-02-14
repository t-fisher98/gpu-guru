import {ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import {ref as databaseRef, get, set, push, remove} from 'firebase/database'
import {db, storage} from '../libs/firebaseConfig'

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

function addProductControls(element) {
  element.querySelector("#edit").addEventListener("click", onEditProduct);
  element.querySelector("#delete").addEventListener("click", onRemoveProduct);
}

async function onEditProduct(e) {
  // Make the modal window to edit visible
  const editModal = document.querySelector('#editModal')
  editModal.style.visibility = "visible"

  // Populate the select list of brands
  populateSelectList();

  async function populateSelectList() {
    const dataRef = databaseRef(db, "brands/");
    const dataSnapshot = await get(dataRef);
    const brands = dataSnapshot.toJSON();
    const brandList = jsonToArray(brands);
    const selectList = document.querySelector("#brandSelect");
    brandList.forEach((brand) => {
      const option = document.createElement("option");
      option.textContent = brand;
      if(selectList.children.length != brandList.length + 1){
        selectList.append(option)
      }
    });
  }

  // Convert JSON to an Array
  function jsonToArray(json) {
    var list = [];
    let values = Object.values(json);
    values.forEach(function (value) {
      list.push(value);
    });
    return list;
  }

  const key = e.currentTarget.dataset.key
  const productRef = await databaseRef(db, `products/${key}`)
  const productSnapshot = await get(productRef)
  
  // Call a function to set the values of the form inputs
  setFormValues(productSnapshot.val())
  const updateButton = document.querySelector('#updateProduct')
  updateButton.dataset.key = key;
  updateButton.addEventListener('click', onUpdateProduct)

  async function onUpdateProduct(e){
    e.preventDefault();
    const updateForm = document.forms['productForm editProduct']
    const file = document.querySelector('#productImage').files[0];
    const brand = updateForm.elements['brand'].value.toLowerCase().trim() + '-logo.png';
    const price = updateForm.elements['price'].value;
    const description = updateForm.elements['description'].value.trim();
    const imageRef = await storageRef(storage, `product-images/${file.name}`);
    const brandRef = await storageRef(storage, `brand-logos/${brand}`);
    const logoPath = brandRef.fullPath;
    const dataRef = await databaseRef(db, `products/${key}`);
    const brandLogo = await getDownloadURL(brandRef);
    const uploadResult = await uploadBytes(imageRef, file);
    const urlPath = await getDownloadURL(imageRef);
    const imagePath = uploadResult.metadata.fullPath;

    await set(dataRef, {
      key,
      imagePath,
      urlPath,
      sku: `GG-${key.substring(1, 8).toUpperCase()}`,
      price,
      description,
      brandLogo,
      logoPath,
    });

    window.location.assign('index.html');
  }
}

async function onRemoveProduct(e) {
  const key = e.currentTarget.dataset.key;
  const dataRef = await databaseRef(db, `products/${key}`);
  const dataSnapshot = await get(dataRef);
  const data = dataSnapshot.val();
  if(confirm(`Product SKU: ${data.sku}
  Are you sure you want to delete this product?`)){
    remove(dataRef)
    window.location.reload()
  }
}

function setFormValues({
  urlPath,
  logoPath,
  description,
  price,
}) {
  const updateForm = document.forms["productForm editProduct"];
  document.querySelector(".display img").src = urlPath;
  const optionList = Array.from(updateForm.elements["brand"].children);
  optionList.forEach((option) =>{
    if(logoPath.includes(option.value.toLowerCase())){
      updateForm.elements['brand'].value = option.value
    }
  })
  updateForm.elements['price'].value = price;
  updateForm.elements['description'].value = description;
}

export { graphicsCard }