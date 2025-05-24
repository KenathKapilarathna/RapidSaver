// src/components/routes/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

interface Props {
  children: JSX.Element;
  role: "admin" | "user" | "driver";
}

const PrivateRoute = ({ children, role }: Props) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.role === role) {
              setAuthorized(true);
            }
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  if (loading) return <div>Loading...</div>;
  return authorized ? children : <Navigate to="/" />;
};

export default PrivateRoute;
