import React, { useEffect, useState } from "react"
import { firestoreKey } from "../firebase/FirebaseKey"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

const CitationGenerator = () => {
  const [data, setData] = useState([])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(firestoreKey, "save"))
    const dataList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setData(dataList)
  }

  const handleAdd = async () => {
    await addDoc(collection(firestoreKey, "save"), { name, age: Number(age) })
    fetchData()
  }

  const handleUpdate = async id => {
    const userDoc = doc(firestoreKey, "save", id)
    await updateDoc(userDoc, { name, age: Number(age) })
    fetchData()
  }

  const handleDelete = async id => {
    const userDoc = doc(firestoreKey, "save", id)
    await deleteDoc(userDoc)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h1>CRUD with Firebase Firestore</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name} - {item.age}
            <button onClick={() => handleUpdate(item.id)}>Update</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CitationGenerator
