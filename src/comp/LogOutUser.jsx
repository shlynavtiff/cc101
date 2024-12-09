import { useEffect, useState } from "react"
import { authKey } from "../firebase/FirebaseKey"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const LogOutUser = () => {
  const [user, setUser] = useState(null)

  const nav = useNavigate()
  useEffect(() => {
    const unsub = onAuthStateChanged(authKey, userCred => {
      if (userCred?.emailVerified) {
        setUser(userCred) // Set the user or null
      } else {
        setUser(null)
        nav(-1)
      }
    })

    return () => unsub() // Cleanup subscription on component unmount
  }, [])

  return [user, setUser]
}

export default LogOutUser
