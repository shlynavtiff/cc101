import React, { useEffect, useState, useCallback } from "react"
import { IoMdClose } from "react-icons/io"
import { firestoreKey } from "../firebase/FirebaseKey"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore"
import IsUser from "./IsUser"

const SaveModal = ({ objectItem, closer }) => {
  const [isChecked, setIsChecked] = useState(false)
  const [user] = IsUser()
  const [data, setData] = useState([])
  const [filteredArr, setFilteredArr] = useState([])
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(
            collection(firestoreKey, "userCollectionOfSave")
          )
          const dataList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setData(dataList)
          setFilteredArr(dataList.filter(itm => itm.Uid === user.uid))
        } catch (error) {
          console.error("Error fetching data: ", error)
        }
      }

      fetchData()
    }
  }, [user, closer])

  useEffect(() => {
    if (user) {
      const handleAdd = async () => {
        try {
          // Fetch all documents in the collection
          const querySnapshot = await getDocs(
            collection(firestoreKey, "userCollectionOfSave")
          )

          // Find the document for the current user
          const userDoc = querySnapshot.docs.find(
            doc => doc.data().Uid === user.uid
          )

          // If the user document is found
          if (userDoc) {
            // Check if MyCollection field exists
            const userData = userDoc.data()
            if (!Array.isArray(userData.MyCollection)) {
              // Update the document to include an empty MyCollection array
              await updateDoc(
                doc(firestoreKey, "userCollectionOfSave", userDoc.id),
                {
                  MyCollection: []
                }
              )
            }
          } else {
            // If the user document is not found, create a new one
            await addDoc(collection(firestoreKey, "userCollectionOfSave"), {
              name: user.displayName || user.email,
              Uid: user.uid,
              MyCollection: [] // Ensure this is initialized as an array
            })
          }

          // Update the local state
          setFilteredArr(prev =>
            prev.map(item =>
              item.Uid === user.uid
                ? {
                    ...item,
                    MyCollection: Array.isArray(item.MyCollection)
                      ? [...item.MyCollection]
                      : []
                  }
                : item
            )
          )
        } catch (error) {
          console.error("Error updating user: ", error)
        }
      }

      handleAdd()
    }
  }, [user, data])

  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked)
  }

  const handleAddToCollection = async () => {
    if (objectItem && isChecked && user) {
      try {
        const querySnapshot = await getDocs(
          collection(firestoreKey, "userCollectionOfSave")
        )
        const existingUserDoc = querySnapshot.docs.find(
          doc => doc.data().Uid === user.uid
        )

        if (existingUserDoc) {
          const userDocRef = doc(
            firestoreKey,
            "userCollectionOfSave",
            existingUserDoc.id
          )

          await updateDoc(userDocRef, {
            MyCollection: arrayUnion({
              Title: objectItem.title,
              Link: objectItem.doi_url,
              Publisher: objectItem.publisher,
              Year: objectItem.year,
              Genre: objectItem.genre,
              Updated: objectItem.updated,
              Authors: objectItem.z_authors,
              type: "article"
            })
          })

          setIsSaved(true)
          closer(null)
        }
      } catch (error) {
        console.error("Error adding to collection: ", error)
      }
    }
  }

  const handleDelete = async () => {
    if (objectItem && user?.uid) {
      try {
        const querySnapshot = await getDocs(
          collection(firestoreKey, "userCollectionOfSave")
        )
        const existingUserDoc = querySnapshot.docs.find(
          doc => doc.data().Uid === user.uid
        )

        if (existingUserDoc) {
          const userDocRef = doc(
            firestoreKey,
            "userCollectionOfSave",
            existingUserDoc.id
          )

          const updatedMyCollection = existingUserDoc
            .data()
            .MyCollection.filter(item => item.Link !== objectItem.doi_url)

          await updateDoc(userDocRef, {
            MyCollection: updatedMyCollection
          })

          setIsSaved(false)
          closer(null)
        }
      } catch (error) {
        console.error("Error deleting from collection: ", error)
      }
    }
  }

  const isItemSaved = useCallback(() => {
    return filteredArr.some(userItem => {
      if (userItem?.MyCollection) {
        userItem.MyCollection.some(
          collectionItem => collectionItem.Link === objectItem.doi_url
        )
      }
    })
  }, [filteredArr, objectItem])

  useEffect(() => {
    setIsSaved(isItemSaved())
    setIsChecked(isItemSaved())
  }, [isItemSaved, objectItem])

  const [showDiv, setShowDiv] = useState(false)

  useEffect(() => {
    // Set a timeout to update the state after 3 seconds
    const timer = setTimeout(() => {
      setShowDiv(true)
    }, 3000)

    // Clean up the timeout if the component unmounts before the timeout completes
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col w-full max-w-[400px] bg-[#f9f9f9] rounded-lg book text-black">
      <div className="h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3">
        <div onClick={() => closer(null)} className="cursor-pointer">
          <IoMdClose />
        </div>
        <div>Save Article</div>
      </div>
      {filteredArr && filteredArr.length === 0 ? (
        <div className="w-full h-[100px] flex items-center justify-center flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 44 44"
            stroke="#000"
          >
            <g fill="none" fillRule="evenodd" strokeWidth="2">
              <circle cx="22" cy="22" r="1">
                <animate
                  attributeName="r"
                  begin="0s"
                  dur="1.8s"
                  values="1; 20"
                  calcMode="spline"
                  keyTimes="0; 1"
                  keySplines="0.165, 0.84, 0.44, 1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  begin="0s"
                  dur="1.8s"
                  values="1; 0"
                  calcMode="spline"
                  keyTimes="0; 1"
                  keySplines="0.3, 0.61, 0.355, 1"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="22" cy="22" r="1">
                <animate
                  attributeName="r"
                  begin="-0.9s"
                  dur="1.8s"
                  values="1; 20"
                  calcMode="spline"
                  keyTimes="0; 1"
                  keySplines="0.165, 0.84, 0.44, 1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  begin="-0.9s"
                  dur="1.8s"
                  values="1; 0"
                  calcMode="spline"
                  keyTimes="0; 1"
                  keySplines="0.3, 0.61, 0.355, 1"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
          {showDiv && (
            <div className="text-[13px] text-gray-500">
              If this takes a while, please reload the process.
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 px-5 bg-white">
          <div className="flex flex-col overflow-y-auto bg-white h-auto pb-3">
            <div>{objectItem && <div>title: {objectItem.title}</div>}</div>
            {filteredArr.map(itm => (
              <div key={itm.id}>
                <div className="flex gap-1 items-center">
                  <input
                    className="pt-2"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <div>My Collection</div>
                </div>
                <div>
                  {itm?.MyCollection &&
                    itm.MyCollection.length > 0 &&
                    itm.MyCollection.map((z, index) => (
                      <div key={index}>{z.title}</div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3">
        {isChecked ? (
          isSaved ? (
            <button className="bg-blue-300 px-3 py-[1px] rounded-lg items-center flex justify-center text-white cursor-not-allowed">
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

export default SaveModal
