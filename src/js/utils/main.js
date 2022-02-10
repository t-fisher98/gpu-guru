import { ref as dataRef, get } from "firebase/database";
import { db } from "../libs/firebaseConfig"
import { graphicsCard } from "../templates/graphicsCard"

async function pageInit() {
  const productRef = dataRef(db, "products/");
  const rentalSnapShot = await get(productRef);
  const productData = rentalSnapShot.val();

  Object.values(productData).map((product) => {
    const card = graphicsCard(product);
    document.querySelector(".products").append(card);
  });
}

pageInit();