import React, { useEffect, useState, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import { firestoreKey } from "../firebase/FirebaseKey";
import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import IsUser from "./IsUser";

const SaveWordModal = ({ wordData, onClose }) => {
  const [user] = IsUser();
  const [userWords, setUserWords] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchUserWords = async () => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(firestoreKey, "userSavedWords"));
          const userDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);

          if (userDoc) {
            setUserWords(userDoc.data().words || []);
            setIsSaved(userDoc.data().words.some(word => word.word === wordData.word));
          }
        } catch (error) {
          console.error("Error fetching user words:", error);
        }
      }
    };

    fetchUserWords();
  }, [user, wordData]);

  const handleSaveWord = async () => {
    if (!user) return;

    try {
      const querySnapshot = await getDocs(collection(firestoreKey, "userSavedWords"));
      const userDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);

      if (userDoc) {
        await updateDoc(doc(firestoreKey, "userSavedWords", userDoc.id), {
          words: arrayUnion(wordData)
        });
      } else {
        await addDoc(collection(firestoreKey, "userSavedWords"), {
          Uid: user.uid,
          words: [wordData]
        });
      }

      setIsSaved(true);
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  const handleRemoveWord = async () => {
    if (!user) return;

    try {
      const querySnapshot = await getDocs(collection(firestoreKey, "userSavedWords"));
      const userDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);

      if (userDoc) {
        const updatedWords = userDoc.data().words.filter(word => word.word !== wordData.word);

        await updateDoc(doc(firestoreKey, "userSavedWords", userDoc.id), {
          words: updatedWords
        });

        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error removing word:", error);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] bg-white rounded-lg shadow-md">
      <div className="h-[50px] w-full flex items-center justify-between bg-gray-200 px-4">
        <div>Save Word</div>
        <button onClick={() => onClose(false)} className="text-gray-600">
          <IoMdClose size={20} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{wordData.word}</h2>
          {wordData.phonetics?.[0]?.text && (
            <p className="text-gray-500">{wordData.phonetics[0].text}</p>
          )}
        </div>
        {isSaved ? (
          <button
            onClick={handleRemoveWord}
            className="w-full bg-red-500 text-white py-2 rounded-md"
          >
            Remove from Saved
          </button>
        ) : (
          <button
            onClick={handleSaveWord}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Save Word
          </button>
        )}
      </div>
    </div>
  );
};

export default SaveWordModal;
