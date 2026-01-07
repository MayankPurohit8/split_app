import {
  ArrowLeft,
  ArrowRightCircle,
  Check,
  Shuffle,
  TurntableIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { avatarGenerator } from "../../../utils/avatarGenerator";
const Register = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  let navigte = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(avatarGenerator());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const checkUsernameValidity = async () => {
    try {
      const res = await axios.post(`${baseUrl}/api/auth/checkusername`, {
        username,
      });
      setValidUsername(res.data.avaliable);
    } catch (err) {}
  };
  const register = async () => {
    try {
      let res = await axios.post(`${baseUrl}/api/auth/register`, {
        email,
        username,
        password,
        name,
        avatarUrl,
      });
      navigte("/login");
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const pageChange = async () => {
    try {
      if (!email || !password) {
        toast.error("one or more empty fields");
        return;
      }
      if (password.length < 8) {
        toast.error("Password length should be greater equals to 8");
        return;
      }
      if (!emailRegex.test(email)) {
        toast.error("Invalid email");
        return;
      }
      const res = await axios.post(`${baseUrl}/api/auth/checkemail`, {
        email: email,
      });
      if (!res.data.avaliable) {
        toast.error("Email already registerd");
        return;
      }
      setNextPage(true);
    } catch (err) {}
  };
  if (!nextPage) {
    return (
      <>
        <div className="w-screen md:w-1/3  h-screen  bg-slate-50">
          <div className="p-5  text-xl">@splitUP </div>
          <header className="flex justify-between h-1/3">
            <div className="flex flex-col justify-end gap-3  pl-5">
              <div className="text-6xl font-bold">Register</div>
              <div className="text-2xl font-semibold text-gray-600">
                Welcome to Split
              </div>
            </div>
            <div className="font-bold p-5 text-xl  cursor-pointer hover:text-black text-gray-600 transition-all duration-150">
              <div className="flex" onClick={() => navigte("/")}>
                Login
              </div>
            </div>
          </header>
          <main className="mt-4">
            <form className="flex flex-col p-5 gap-2">
              <div className="space-y-2">
                <div className="text-sm">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm">Password</div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
                />
              </div>
            </form>
            <div className="w-full flex justify-end transition-all pl-5 mt-5">
              <button
                onClick={() => pageChange()}
                className="cursor-pointer bg-yellow-300 rounded-s-2xl w-1/2 p-4 text-left text-lg hover:w-full transition-all duration-500 delay-50 font-semibold"
              >
                Join Split
              </button>
              <div className=" cursor-pointer bg-yellow-300 flex items-center px-5">
                <ArrowRightCircle size={30} />
              </div>
            </div>
          </main>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className=" absolute p-7" onClick={() => setNextPage(false)}>
          <ArrowLeft />
        </div>
        <div className="h-screen flex items-center justify-center flex-col gap-5 bg-slate-50">
          <div className="text-left px-4 mb-8 w-full text-5xl font-bold ">
            User Details :
          </div>
          <div className="flex flex-col items-center gap-5">
            <div className="h-32 w-32 border rounded-full overflow-hidden ">
              <img className="" src={avatarUrl} alt="" />
            </div>
            <div
              className="p-2 rounded-full border bg-amber-300 active:bg-amber-200"
              onClick={() => setAvatarUrl(avatarGenerator())}
            >
              <Shuffle />
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
              />
            </div>
            <div className="space-y-2 ">
              <div className="text-sm ">username</div>
              <div className="w-full  text-xl font-semibold shadow-md rounded-xl bg-white h-15 relative">
                <input
                  value={username}
                  onBlur={checkUsernameValidity}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="  w-8/10 px-5 text-xl font-semibold  rounded-xl bg-white h-15 outline-none "
                />
                {username && (
                  <div
                    className={`absolute right-5 top-5 ${
                      validUsername ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {validUsername ? <Check /> : <X />}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end transition-all pl-5 mt-5">
            <button
              onClick={() => register()}
              className="cursor-pointer bg-yellow-300 rounded-s-2xl w-1/2 p-4 text-left text-lg hover:w-full transition-all duration-500 delay-50 font-semibold"
            >
              Continue
            </button>
            <div className=" cursor-pointer bg-yellow-300 flex items-center px-5">
              <ArrowRightCircle size={30} />
            </div>
          </div>
        </div>
      </>
    );
  }
};
export default Register;
