import { doc, getDoc } from "firebase/firestore";
import { authKey, firestoreKey } from "./firebase/FirebaseKey";

const checkIfBanned = async (uid) => {
    try {
        const userDoc = doc(firestoreKey, "userCollectionOfSave", uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (userData.MyCollection.isBanned) {
                alert("Your account is banned. Please contact support.");
                await authKey.signOut();
                window.location.href = "/banned"; // Redirect to a banned page
                return false;
            }
        }
    } catch (error) {
        console.error("Error checking ban status:", error);
    }
    return true;
};

// Call this function during app initialization or after login
authKey.onAuthStateChanged(async (user) => {
    if (user) {
        const canAccess = await checkIfBanned(user.uid);
        if (!canAccess) return;
        // Proceed with app initialization
    }
});
