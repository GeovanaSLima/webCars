import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";


export function DashHeader() {
  
  async function handleLogout() {
    await signOut(auth);
  }

  return(
    <div className="w-full flex items-center h-10 bg-primary-600 rounded-lg text-gray-50 font-medium gap-4 px-4 mb-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>

      <button className="ml-auto" onClick={handleLogout}>Sair da conta</button>
    </div>
  )
}