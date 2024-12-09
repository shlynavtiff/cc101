import React, { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import { deleteUser } from "firebase/auth"
import IsUser from "../IsUser"

import { collection, getDocs, deleteDoc } from "firebase/firestore"

import { firestoreKey } from "../../firebase/FirebaseKey"
import LoadingSvg from "../LoadingSvg"
import { useNavigate } from "react-router-dom"

const DeleteAccountModal = ({ closer }) => {
  const [user, setUser] = IsUser()

  const [data, setData] = useState([])

  const [isCompeleteDelete, setIsComplete] = useState(false)

  const nav = useNavigate()

  const DeleteUserFunc = async () => {
    setIsComplete(true)
    try {
      const querySnapshot = await getDocs(
        collection(firestoreKey, "userCollectionOfSave")
      )
      const existingUserDoc = querySnapshot.docs.find(
        doc => doc.data().Uid === user?.uid
      )

      if (existingUserDoc) {
        await deleteDoc(existingUserDoc.ref)
        setIsComplete(false)
        if (user) {
          deleteUser(user)
            .then(() => {
              console.log("USER DELETED")
              nav("/sign-in")
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const [password, setPassword] = useState("")

  const confirmPass = localStorage.getItem("userPassword")

  useEffect(() => {
    console.log(localStorage)
  }, [confirmPass])

  const [email, setEmail] = useState("")

  function confirmDeleteByLogIn() {
    if (user?.providerData[0].providerId === "google.com") {
      if (email === user?.email) {
        DeleteUserFunc()
      }
    }

    if (user?.providerData[0].providerId === "password") {
      if (user === null) {
        return
      }

      if (confirmPass === password) {
        DeleteUserFunc()
      } else {
        console.log("passwords are not the same")
      }
    }
  }

  return (
    <div
      className="w-full h-full max-w-[500px] max-h-[500px] bg-[#f9f9f9] rounded-lg overflow-hidden"
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <div className="h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3">
        <div onClick={() => closer(false)} className="cursor-pointer">
          <IoMdClose />
        </div>
        <div className="text-lg font-semibold">Delete Account</div>
      </div>
      <div className="p-3">
        <div className="text-lg font-semibold text-red-700">Confirmation</div>
        {user?.providerData[0].providerId === "google.com" && (
          <>
            <div className="text-[#888]">
              To Delete your Account kindly type your email.
            </div>
            <div className="text-[#888] mt-2">
              Note: once you deleted your account there's no way to retrieve it,
              This is permanent.
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <input
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                }}
                className="h-[50px] border-[#888] border-[1px] outline-none rounded-lg px-2"
                type="text"
                placeholder="E-mail"
              />
              <button
                onClick={() => {
                  confirmDeleteByLogIn()
                }}
                className={` ${user?.email === email &&
                  "bg-red-700 cursor-pointer"} flex items-center justify-center gap-2 bg-red-300 cursor-not-allowed text-white px-3 py-2 rounded-md`}
              >
                {isCompeleteDelete && <LoadingSvg />} Delete Account
              </button>
            </div>
          </>
        )}

        {user?.providerData[0].providerId === "password" && (
          <>
            <div className="text-[#888]">
              To Delete your Account kindly make sure to confirm your password.
            </div>
            <div className="text-[#888] mt-2">
              Note: once you deleted your account there's no way to retrieve it,
              This is permanent.
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <input
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                }}
                className="h-[50px] border-[#888] border-[1px] outline-none rounded-lg px-2"
                type="password"
                placeholder="Password"
              />
              <button
                onClick={() => {
                  confirmDeleteByLogIn()
                }}
                className={` ${confirmPass === password &&
                  "bg-red-700 cursor-pointer"} flex items-center justify-center gap-2 bg-red-300 cursor-not-allowed text-white px-3 py-2 rounded-md`}
              >
                {isCompeleteDelete && <LoadingSvg />} Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DeleteAccountModal
