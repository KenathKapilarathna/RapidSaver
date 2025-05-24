import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getReviews = async () => {
  const reviewsRef = collection(db, "reviews");
  const querySnapshot = await getDocs(reviewsRef);
  const reviews = querySnapshot.docs.map((doc) => ({
    rid: doc.id,
    ...doc.data(),
  }));
  return reviews;
};
