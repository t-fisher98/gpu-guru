import { ref as dataRef, get } from "firebase/database";
import { db } from '../libs/firebaseConfig'
import { graphicsCard } from "../templates/graphicsCard"

pageInit();

async function pageInit() {
  const sideBar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector("#toggle")
  const logo = document.querySelector("#logo")
  const modal = document.querySelector('.modal')
  const cancelButton = document.querySelector('#cancelUpdate')
  document
    .querySelector("#productImage")
    .addEventListener("change", onImageSelected);
  window.addEventListener("click", onCloseModal);
  cancelButton.addEventListener('click', onCloseModal)

  toggleButton.addEventListener("click", onToggleSideBar)
  logo.addEventListener("click", onToggleSideBar);
  
  const productRef = dataRef(db, "products/");
  const rentalSnapShot = await get(productRef);
  const productData = rentalSnapShot.val();

  Object.values(productData).map((product) => {
    const card = graphicsCard(product);
    document.querySelector(".products").append(card);
  });

  function onToggleSideBar(e) {
    if (e.currentTarget == toggleButton) {
      sideBar.style.width = "5rem";
    } else {
      sideBar.style.width = "18.75rem";
    }
  }

  function onImageSelected(e) {
    // Get a reference to the selected file
    let file = e.target.files[0];

    // Update the display with the requested image
    document.querySelector(".display img").src = URL.createObjectURL(file);
  }

  function onCloseModal(e){
    if (e.target == modal || e.target == cancelButton) {
      modal.style.visibility = "hidden";
    }
  }
}