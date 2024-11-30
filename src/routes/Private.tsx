import { ReactNode, useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/loader";
import { Navigate } from "react-router-dom";


interface PrivateProps {
  children: ReactNode
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext)

  if(loadingAuth) {
    return <Loader loading={loadingAuth} />
  }

  if (!signed) {
    return<Navigate to="/login" />
  }
  
  return children;
}