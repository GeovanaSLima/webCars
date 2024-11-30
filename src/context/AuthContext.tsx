import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleUserInfo: ({ uid, name, email }: UserProps) => void; 
  user: UserProps | null;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email
        })

        setLoadingAuth(false);

      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    })

    return () => {
      unsub();
    }

  }, [])


  function handleUserInfo({ uid, name, email }: UserProps) {
    setUser({uid, name, email});
  }


  return(
    <AuthContext.Provider 
     value={{ 
      signed: !!user,
      loadingAuth,
      handleUserInfo,
      user
     }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;