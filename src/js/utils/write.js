import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, push, set, get } from "firebase/database";
import { db, storage } from "../libs/firebaseConfig";

document.forms["productForm"].addEventListener("submit", onAddProduct);

document.querySelector("#productImage").addEventListener("change", onImageSelected);

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
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
  // checkImageUpload(file);
}

// async function checkImageUpload(file) {
//   // Get a reference to the path where we want to store the image.
//   const imageRef = await storageRef(storage, file.name);
//   const confirmation = await uploadBytes(imageRef, file);
//   const path = await getDownloadURL(imageRef);
// }

async function uploadNewProduct() {
  // Reference variables to the dom elements
  const file = document.querySelector("#productImage").files[0];
  const brand = document.querySelector("#brandSelect").value.trim() + '-logo.png';
  const price = document.querySelector("#price").value;
  const description = document.querySelector("#description").value;

  // Reference to where the image will be stored
  const imageRef = await storageRef(storage, `product-images/${file.name}`);

  // Reference to where the brand logo is stored
  const brandRef = await storageRef(storage, `brand-logos/${brand}`);

  // Reference to where the data object will be stored
  const dataRef = await databaseRef(db, 'products');

  // Url to the brand logo image in storage
  const brandLogo = await getDownloadURL(brandRef);

  // Uploading the image to the storage bucket
  await uploadBytes(imageRef, file);

  // Url to the product image in storage
  const urlPath = await getDownloadURL(imageRef);

  // Pushing the data object to the database
  const itemRef = await push(dataRef);
  alert("Product added to the database")

  set(itemRef, {
    key: itemRef.key,
    urlPath,
    sku: `GG-${getRndInteger(000000, 999999)}`,
    price,
    description,
    brandLogo,
  });
}
