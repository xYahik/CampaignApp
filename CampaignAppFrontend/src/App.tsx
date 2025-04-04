import { Home } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useAuth } from "@/components/ui/AuthProvider";


function App() {

  const {token,handleLogout,currentUser} = useAuth();

  return (
    <>
      <div className="w-full bg-gray-100 py-2 px-4 flex justify-between items-center shadow-md mb-[20px]">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <div className="flex items-center space-x-4">
          {token != null ? (
            <>
              <div className="bg-gray-400 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-400">
                Funds: {currentUser?.currentFunds?.toString()}
              </div>
              <Link
                to="/campaign/create"
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                New Campaigns
              </Link>
              <Link
                to="/campaign/my"
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                My Campaigns
              </Link>
              <button onClick={()=> {handleLogout()}}
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                Register
              </Link>
              <Link
                to="/Login"
                className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default App;
