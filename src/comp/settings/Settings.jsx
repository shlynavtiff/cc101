import React, { useEffect, useState } from "react";
import Header from "../Header";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import IsUser from "../IsUser";
import userIMG from "../images/userIMG.png";
import { authKey } from "../../firebase/FirebaseKey";
import { updatePassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteAccountModal from "./DeleteAccountModal";

const Settings = () => {
  const [user, setUser] = IsUser();
  const nav = useNavigate();

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isConfirm, setIsConfirm] = useState("");
  const [deleteAccount, setDeleteAccount] = useState(false);

  const [newDisplayName, setNewDisplayName] = useState("");

  const errorModal = (text) => {
    toast.error(text, { position: "bottom-right", autoClose: 5000 });
  };

  const successModal = (text) => {
    toast.success(text, { position: "bottom-right", autoClose: 5000 });
  };

  const changeUserPassword = () => {
    if (newPass !== isConfirm) return errorModal("Please make sure the passwords are the same");
    if (!currentPass || !newPass || !isConfirm) return errorModal("Please fill in all fields");
    if (!user) return errorModal("User not found");

    const email = user?.email;
    signInWithEmailAndPassword(authKey, email, currentPass)
      .then((res) => {
        updatePassword(res?.user, newPass)
          .then(() => {
            setNewPass("");
            setCurrentPass("");
            setIsConfirm("");
            successModal("Password Successfully Changed!");
          })
          .catch(() => errorModal("Error changing your password"));
      })
      .catch(() => errorModal("Incorrect current password"));
  };

  const changeDisplayName = () => {
    if (!newDisplayName.trim()) {
      return errorModal("Display name cannot be empty.");
    }

    updateProfile(authKey.currentUser, { displayName: newDisplayName })
      .then(() => {
        successModal("Display Name Updated Successfully!");
        setNewDisplayName("");
        setUser({ ...user, displayName: newDisplayName });
      })
      .catch(() => errorModal("Error updating display name."));
  };

  return (
    <div className="mt-[80px] px-6">
      <ToastContainer />
      {deleteAccount && (
        <div onClick={() => setDeleteAccount(false)} className="modalPos">
          <DeleteAccountModal closer={setDeleteAccount} />
        </div>
      )}

      {/* Header */}
      <Header locString="Settings" bookSee={false} inputSee={false} />

      {/* Main Section */}
      <section className="w-full h-[90dvh] bg-gray-200 rounded-xl p-6">
        {/* Back Button */}
        <div
          onClick={() => nav(-1)}
          className="flex gap-3 items-center mb-4 cursor-pointer"
        >
          <div className="bg-gray-400 p-1 rounded-md">
            <IoIosArrowBack />
          </div>
          <span className="text-black">Settings</span>
        </div>

        {user && (
          <div className="w-full h-full flex flex-col overflow-auto">
            {/* Account Information */}
            <div className="bg-gray-300 p-3 rounded-lg mb-5">
              <h2 className="font-semibold text-black">Account</h2>
              <p className="text-black">Manage your account details here.</p>
            </div>

            <div className="flex gap-1 items-center flex-col md:flex-row">
              <div className="md:w-[100px] md:h-[100px]  rounded-lg overflow-hidden">
                {user?.photoURL ? (
                  <img className="md:w-full md:h-full w-full h-[75px]" src={user.photoURL} alt="User" />
                ) : (
                  <img className="md:w-full md:h-full w-full h-[75px]" src={userIMG} alt="User" />
                )}
              </div>
              <div className="text-black">
                <div className="font-medium">Email: {user?.email}</div>
                <div>Display Name: {user?.displayName || "No Display Name"}</div>
                <div>Creation Time: {user?.metadata.creationTime}</div>
                <div>
                  Provider: {user?.providerData[0]?.providerId || "No Provider"}
                </div>
              </div>
            </div>

            {/* Update Display Name */}
            <div className="mt-5 bg-gray-300 p-3 rounded-lg flex flex-col">
              <h3 className="font-semibold text-black mb-3">Update Display Name</h3>
              <div className="flex gap-3 items-center md:flex-row flex-col">
                <input
                  type="text"
                  className="p-2 rounded-lg border border-gray-800"
                  placeholder="Enter new display name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
                <button
                  onClick={changeDisplayName}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Password Section */}
            {user?.providerData[0]?.providerId === "password" && (
              <div className="mt-5 bg-gray-300 p-3 rounded-lg">
                <h3 className="font-semibold text-black mb-3">Change Password</h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="text-black">Current Password</label>
                    <input
                      className="p-2 rounded-lg border border-gray-800"
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-black">New Password</label>
                    <input
                      className="p-2 rounded-lg border border-gray-800"
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-black">Confirm New Password</label>
                    <input
                      className="p-2 rounded-lg border border-gray-800"
                      type="password"
                      value={isConfirm}
                      onChange={(e) => setIsConfirm(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={changeUserPassword}
                  className={`mt-4 px-4 py-2 text-white rounded-md ${
                    newPass === isConfirm &&
                    currentPass &&
                    newPass &&
                    isConfirm
                      ? "bg-gray-800 cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  Change Password
                </button>
              </div>
            )}

            {/* Delete Account */}
            <div className="mt-5 bg-gray-300 p-3 rounded-lg">
              <h3 className="font-semibold text-black mb-3">Delete Account</h3>
              <button
                onClick={() => setDeleteAccount(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;
