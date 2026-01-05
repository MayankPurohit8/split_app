import { ArrowRightCircle, Check, X } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
const Register = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  let navigte = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [validUsername, setValidUsername] = useState(false);
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
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  return (
    <>
      <div className="w-screen md:w-1/4  h-screen  bg-slate-50">
        <header className="flex justify-between h-1/4">
          <div className="flex flex-col justify-end gap-3  pl-5">
            <div className="text-6xl font-bold">Register</div>
            <div className="text-2xl font-semibold text-gray-600">
              Welcome to Split
            </div>
          </div>
          <div className="font-bold p-5 text-xl  cursor-pointer hover:text-black text-gray-600 transition-all duration-150">
            <div className="" onClick={() => navigte("/")}>
              Login
            </div>
          </div>
        </header>
        <main className="mt-4">
          <form className="flex flex-col p-5 gap-2">
            <div className="space-y-2">
              <div className="text-sm">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className=" px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
              />
            </div>
            <div className="space-y-2 ">
              <div className="text-sm">Username</div>
              <div className="relative">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={checkUsernameValidity}
                  type="text"
                  className=" px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
                />
                {username && (
                  <div
                    className={` transition-all absolute top-5 right-3 ${
                      validUsername ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {username && validUsername ? <Check /> : <X />}
                  </div>
                )}
              </div>
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
              onClick={() => register()}
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
};
export default Register;
