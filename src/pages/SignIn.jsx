import React, { useEffect, useState } from "react";
import SignInModal from "../comp/SignInModal";
import Header from "../comp/Header";
import { onAuthStateChanged } from "firebase/auth";
import { authKey } from "../firebase/FirebaseKey";
import { useNavigate } from "react-router-dom";
import IsUser from "../comp/IsUser";
import Footer from "../comp/wasd/Footer";

const SignIn = () => {
  const [user] = IsUser(); // Custom hook to get the user
  const [loading, setLoading] = useState(true); // Loading state
  const nav = useNavigate();

  // Monitor auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(authKey, (creds) => {
      setLoading(false); // Stop loading after checking auth
    });

    return () => unsub();
  }, []);

  // Loading screen while checking auth state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header inputSee={false} bookSee={false} locString={"Signin"} />
      <div className="flex-grow flex items-center justify-center p-3 min-h-[600px] w-full">
        <div className="w-full max-w-4xl justify-center flex items-center">
          {user != null && user?.emailVerified ? (
            <div>
              <div className="text-xl text-center">
                Welcome!{" "}
                <span className="font-semibold">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <div className="text-center mt-3 text-[13px] text-white">
                Navigate to:
              </div>
              <div className="flex gap-3 items-center justify-center mt-1">
                <div
                  onClick={() => nav("/")}
                  className="bg-[#292929] py-1 px-3 rounded-lg text-white cursor-pointer"
                >
                  Home
                </div>
                <div
                  onClick={() => nav("/article")}
                  className="bg-[#292929] py-1 px-3 rounded-lg text-white cursor-pointer"
                >
                  Articles
                </div>
                <div
                  onClick={() => nav("/book-finder")}
                  className="bg-[#292929] py-1 px-3 rounded-lg text-white cursor-pointer"
                >
                  Books
                </div>
              </div>
            </div>
          ) : (
            <SignInModal isDataSave={false} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
