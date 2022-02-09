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
  const productName = document.querySelector("#productName").value.trim();
  const file = document.querySelector("#productImage").files[0];
  const imageRef = await storageRef(storage, `images/${file.name}`);
  const dataRef = await databaseRef(db, "products");
  const uploadResult = await uploadBytes(imageRef, file);
  const path = await getDownloadURL(imageRef);
  const imagePath = uploadResult.metadata.fullPath;
  const itemRef = push(dataRef);
  console.log(itemRef);

  set(itemRef, {
    key: itemRef.key,
    path,
    productName,
  });
}
