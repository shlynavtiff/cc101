import { Navigate, Outlet } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestoreKey } from "../firebase/FirebaseKey";

const ProtectedRoute = ({ userId }) => {
  const [isBanned, setIsBanned] = React.useState(null);

  React.useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const userDoc = doc(firestoreKey, "userCollectionOfSave", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsBanned(data.MyCollection?.isBanned || false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    fetchUserStatus();
  }, [userId]);

  if (isBanned === null) return <div>Loading...</div>; // Wait for data to load

  return isBanned ? <Navigate to="/banned" replace /> : <Outlet />;
};

export default ProtectedRoute;
