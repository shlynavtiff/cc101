import { useEffect, useState } from "react"
import { authKey } from "../firebase/FirebaseKey"
import { onAuthStateChanged } from "firebase/auth"

const IsUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(authKey, userCred => {
      if (userCred?.emailVerified) {
        setUser(userCred) // Set the user or null
      } else {
        setUser(null)
      }
    })

    return () => unsub() // Cleanup subscription on component unmount
  }, [])

  return [user, setUser]
}

export default IsUser
