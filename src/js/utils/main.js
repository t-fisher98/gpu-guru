import { ref as dataRef, get } from "firebase/database";
import { db } from "../libs/firebaseConfig"
import { graphicsCard } from "../templates/graphicsCard"

async function pageInit() {
  const productRef = dataRef(db, "products/");
  const rentalSnapShot = await get(productRef);
  const data = rentalSnapShot.val();

  console.log(productRef);
  console.log(rentalSnapShot);
  console.log(data);

  Object.values(data).map((rental) => {
    const card = graphicsCard(rental);
    document.querySelector("main").append(card);
  });
}

pageInit();