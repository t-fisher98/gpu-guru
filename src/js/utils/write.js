import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, push, set, get } from "firebase/database";
import { db, storage } from "../libs/firebaseConfig";

document.forms["productForm"].addEventListener("submit", onAddProduct);

document
  .querySelector("#productImage")
  .addEventListener("change", onImageSelected);

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
  checkImageUpload(file);
}

async function checkImageUpload(file) {
  // Get a reference to the path where we want to store the image.
  const imageRef = await storageRef(storage, file.name);
  const confirmation = await uploadBytes(imageRef, file);
  const path = await getDownloadURL(imageRef);
}

async function uploadNewProduct() {
  // Reference variables to the dom elements
  const file = document.querySelector("#productImage").files[0];
  const brand = document.querySelector("#brandSelect").value.trim() + '-logo.png';
  const price = document.querySelector("#price").value;
  const description = document.querySelector("#description").value;

  // Reference to where the image will be stored
  const imageRef = await storageRef(storage, `images/product-images/${file.name}`);
  console.log(imageRef)

  // Reference to where the brand logo is stored
  const brandRef = await storageRef(storage, `images/brand-logos/${brand}`);
  console.log(brandRef)

  // Reference to where the data object will be stored
  const dataRef = await databaseRef(db, 'products');

  // Url to the brand logo image in storage
  const brandLogo = await getDownloadURL(brandRef);
  console.log(brandLogo)

  // Uploading the image to the storage bucket
  const uploadResult = await uploadBytes(imageRef, file);

  // Url to the product image in storage
  const urlPath = await getDownloadURL(imageRef);
  console.log(urlPath)

  // const imagePath = uploadResult.metadata.fullPath;
  const itemRef = await push(dataRef);

  set(itemRef, {
    key: itemRef.key,
    urlPath,
    sku: "GG" + itemRef.key.substring(0, 7).toUpperCase(),
    price,
    description,
    brandLogo,
  });
}
