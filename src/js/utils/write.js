import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, push, set, get } from "firebase/database";
import { db, storage } from "../libs/firebaseConfig";

pageInit();

function pageInit(){
  const sideBar = document.querySelector(".sidebar");
  const toggleButton = document
    .querySelector("#toggle")
    .addEventListener("click", onToggleSideBar);
  const logo = document
    .querySelector("#logo")
    .addEventListener("click", onToggleSideBar);

  document.forms["productForm"].addEventListener("submit", onAddProduct);

  document.querySelector("#productImage").addEventListener("change", onImageSelected);

  populateSelectList();

  function onToggleSideBar(e) {
    let toggleButton = document.querySelector("#toggle");
    if (e.currentTarget == toggleButton) {
      sideBar.style.width = "5rem";
    } else {
      sideBar.style.width = "18.75rem";
    }
  }
}

// Product form handler function
function onAddProduct(e) {
  e.preventDefault();
  uploadNewProduct();
}

// File input change event handler
function onImageSelected(e) {
  // Get a reference to the selected file
  let file = e.target.files[0];

  // Update the display with the requested image
  document.querySelector(".display img").src = URL.createObjectURL(file);
}

async function populateSelectList(){
  const dataRef = databaseRef(db, 'brands/');
  const dataSnapshot = await get(dataRef)
  const brands = dataSnapshot.toJSON();
  const selectList = document.querySelector('#brandSelect')
  const brandList = jsonToArray(brands);
  brandList.forEach((brand) => {
    const option = document.createElement("option")
    option.textContent = brand;
    selectList.append(option)
  })
}

function jsonToArray(json) {
  var list = [];
  let values = Object.values(json);
  values.forEach(function (value) {
    list.push(value);
  });
  return list;
}

async function uploadNewProduct() {
  // Reference variables to the dom elements
  const file = document.querySelector("#productImage").files[0];
  const brand = document.querySelector("#brandSelect").value.toLowerCase().trim() + '-logo.png';
  const price = document.querySelector("#price").value;
  const description = document.querySelector("#description").value.trim();

  // Reference to where the image will be stored
  const imageRef = await storageRef(storage, `product-images/${file.name}`);

  // Reference to where the brand logo is stored
  const brandRef = await storageRef(storage, `brand-logos/${brand}`);
  
  const logoPath = brandRef.fullPath;

  // Reference to where the data object will be stored
  const dataRef = await databaseRef(db, 'products');

  // Url to the brand logo image in storage
  const brandLogo = await getDownloadURL(brandRef);

  // Uploading the image to the storage bucket
  const uploadResult = await uploadBytes(imageRef, file);

  // Url to the product image in storage
  const urlPath = await getDownloadURL(imageRef);

  // Direct path to the image in storage
  const imagePath = uploadResult.metadata.fullPath;

  // Pushing the data object to the database
  const itemRef = await push(dataRef);

  await set(itemRef, {
    key: itemRef.key,
    imagePath,
    urlPath,
    sku: `GG-${itemRef.key.substring(1, 8).toUpperCase()}`,
    price,
    description,
    brandLogo,
    logoPath
  });

  if(!confirm("Would you like to add another product?")){
    window.location.assign('index.html')
  }else{
    window.location.reload();
  }
}

