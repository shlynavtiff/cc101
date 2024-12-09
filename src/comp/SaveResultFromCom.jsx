import React, { useEffect, useState } from "react"
import IsUser from "./IsUser"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore"
import { firestoreKey } from "../firebase/FirebaseKey"

import LoadingSvg from "./LoadingSvg"

const SaveResultFromCom = ({ resultToSave, closer }) => {
  const [user] = IsUser()
  const [filteredUser, setFIlteredUser] = useState(null)

  useEffect(() => {
    const toParse = JSON.stringify(resultToSave)
    console.log(resultToSave)
  }, [resultToSave])

  useEffect(() => {
    if (user) {
      const fetchDataOfUser = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(firestoreKey, "userCollectionOfSave")
          )
          const dataList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          const filteredArrOfUser = dataList.filter(itm => itm.Uid === user.uid)

          console.log(filteredArrOfUser)
          setFIlteredUser(filteredArrOfUser)
        } catch (err) {
          console.log(err)
        }
      }
      fetchDataOfUser()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      const handleAddEmptyArr = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(firestoreKey, "userCollectionOfSave")
          )
          const userDoc = querySnapshot.docs.find(
            doc => doc.data().Uid === user.uid
          )

          if (userDoc) {
            // Check if MyCollection field exists
            const userData = userDoc.data()
            if (!Array.isArray(userData.MyComputationArr)) {
              // Update the document to include an empty MyCollection array
              await updateDoc(
                doc(firestoreKey, "userCollectionOfSave", userDoc.id),
                {
                  MyComputationArr: []
                }
              )
            }
          } else {
            // If the user document is not found, create a new one
            await addDoc(collection(firestoreKey, "userCollectionOfSave"), {
              name: user.displayName || user.email,
              Uid: user.uid,
              MyComputationArr: []
            })
          }

          setFIlteredUser(prev =>
            prev.map(item =>
              item.Uid === user.uid
                ? {
                    ...item,
                    MyComputationArr: Array.isArray(item.MyComputationArr)
                      ? [...item.MyComputationArr]
                      : []
                  }
                : item
            )
          )
        } catch (err) {
          console.log(err)
        }
      }
      handleAddEmptyArr()
    }
  }, [user])

  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked)
  }
  const [isSaved, setIsSaved] = useState(false)

  const [parsedData, setParsedData] = useState(null)

  const handleAddToCollection = async () => {
    if (resultToSave && user) {
      try {
        const querySnapshot = await getDocs(
          collection(firestoreKey, "userCollectionOfSave")
        )
        const existingUserDoc = querySnapshot.docs.find(
          doc => doc.data().Uid === user.uid
        )

        // parseString(resultToSave, function (err: any, result: any) {
        //     if (err) {
        //         console.error(err)
        //     } else {
        //         setParsedData(result)
        //     }
        // });

        if (existingUserDoc && resultToSave != null) {
          const userDocRef = doc(
            firestoreKey,
            "userCollectionOfSave",
            existingUserDoc.id
          )

          await updateDoc(userDocRef, {
            MyComputationArr: arrayUnion({
              resultItem: resultToSave,
              docID: Date.now(),
              type: "article"
            })
          })

          closer(false)
        }
      } catch (error) {
        console.error("Error adding to collection: ", error)
      }
    }
  }

  const handleDelete = async () => {
    if (resultToSave && user?.uid) {
      // try {
      //     const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
      //     const existingUserDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);
      //     if (existingUserDoc) {
      //         const userDocRef = doc(firestoreKey, 'userCollectionOfSave', existingUserDoc.id);
      //         const updatedMyCollection = existingUserDoc.data().MyCollection.filter((item: ResponseObject) =>
      //             item.Link !== resultToSave);
      //         await updateDoc(userDocRef, {
      //             MyCollection: updatedMyCollection,
      //         });
      //         setIsSaved(false);
      //         closer(null);
      //     }
      // } catch (error) {
      //     console.error("Error deleting from collection: ", error);
      // }
    }
  }

  const [data, setData] = useState(null)

  return (
    <div className="bg-white rounded-lg book w-full max-w-[400px] overflow-hidden text-black">
      <div className="h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3">
        <div onClick={() => closer(false)} className="cursor-pointer">
          {/* <IoMdClose /> */}
        </div>
        <div>Save Result</div>
      </div>
      {filteredUser ? (
        <div className="flex gap-2 px-3 h-[70px] items-center">
          <input
            className="pt-2"
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div>Result Collection</div>
        </div>
      ) : (
        <div className="flex gap-3 px-3 h-[100px] items-center justify-center">
          <LoadingSvg />
        </div>
      )}
      <div className="h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3">
        {isChecked ? (
          isSaved ? (
            <button className="bg-blue-300 px-3 py-[1px] rounded-lg text-white cursor-not-allowed">
              Saved
            </button>
          ) : (
            <button
              onClick={handleAddToCollection}
              className="bg-blue-500 px-3 py-[1px] rounded-lg text-white cursor-pointer"
            >
              Save
            </button>
          )
        ) : isSaved ? (
          <button
            onClick={handleDelete}
            className="bg-blue-500 px-3 py-[1px] rounded-lg text-white cursor-pointer"
          >
            Remove
          </button>
        ) : (
          <button className="bg-blue-300 px-3 py-[1px] rounded-lg text-white cursor-not-allowed">
            Save
          </button>
        )}
      </div>
    </div>
  )
}

export default SaveResultFromCom
