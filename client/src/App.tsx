import { useAuth } from "@clerk/clerk-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Loading } from "./components/general"

function App() {

  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!isLoaded) {
    return <Loading isLoading={"loading"} />
  }

  if (!isSignedIn && !location.pathname.includes("/auth")) {
    navigate("/auth/signin")
  }

  return (
    <div className="min-h-screen w-screen">
      <Outlet />
    </div>
  )
}

export default App