import { ref as dataRef, get } from "firebase/database";
import { db } from "../libs/firebaseConfig"
import { graphicsCard } from "../templates/graphicsCard"

const dashboard = document.querySelector('.products');
const sideBar = document.querySelector('.side-bar');

pageInit();

async function pageInit() {
  const toggleButton = document.querySelector('#toggle').addEventListener('click', onToggleSideBar);

  const productRef = dataRef(db, "products/");
  const rentalSnapShot = await get(productRef);
  const productData = rentalSnapShot.val();

  Object.values(productData).map((product) => {
    const card = graphicsCard(product);
    document.querySelector(".products").append(card);
  });
}

function onToggleSideBar(e) {
  if (sideBar.style.width != "2.5rem") {
    sideBar.style.width = "2.5rem";
    dashboard.style.marginLeft = "6.5rem";
    e.currentTarget.style.transform = "rotate(180deg)";
  } else {
    sideBar.style.width = "10rem";
    dashboard.style.marginLeft = "14rem";
    e.currentTarget.style.transform = null;
  }
}