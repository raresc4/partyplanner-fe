import { UsersRound } from "lucide-react";
import { useNavigate } from "react-router";
import { logout } from "../Actions/user";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-auto pt-5 pl-8 pr-8 flex flex-row items-center justify-between bg-white">
        <div className="flex flex-row items-center gap-x-2 hover:transition-all hover:text-cyan-300 hover:cursor-pointer">
          <UsersRound size={32} />
          <h1 className="text-3xl font-black">PartyPlanner</h1>
        </div>

        <ul className="list-none flex flex-row gap-x-5 text-2xl">
          <li
            className="hover:font-bold hover:transition-all hover:cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            Profile
          </li>
          <li
            className="hover:font-bold hover:transition-all hover:cursor-pointer"
            onClick={() => navigate("/about")}
          >
            About
          </li>
          <li
            onClick={() =>
              logout()
                .then(() => navigate("/"))
                .catch(() => toast.error("Logout failed"))
            }
            className="hover:font-bold hover:transition-all hover:cursor-pointer"
          >
            Log out
          </li>
        </ul>
      </div>
    </>
  );
}
