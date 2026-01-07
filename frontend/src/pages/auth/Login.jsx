import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";
const Login = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [emailorusername, setEmailorusernme] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const Login = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/auth/login`,
        {
          emailorusername,
          password,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  return (
    <>
      <div className="w-screen md:w-1/4  h-screen  bg-slate-50">
        <header className="flex justify-between h-1/3">
          <div className="flex flex-col justify-end gap-3  pl-5">
            <div className="text-6xl font-bold">Login</div>
            <div className="text-2xl font-semibold text-gray-600">
              Welcome Back!
            </div>
          </div>
          <div className="font-bold p-5 text-xl cursor-pointer hover:text-black text-gray-600">
            <div className="" onClick={() => navigate("/register")}>
              SignUp
            </div>
          </div>
        </header>
        <main className="mt-4">
          <form className="flex flex-col p-5 gap-3">
            <div className="space-y-2">
              <div className="text-sm">Email/Username</div>
              <input
                value={emailorusername}
                onChange={(e) => setEmailorusernme(e.target.value)}
                type="text"
                className="ring-yellow-300 px-5 text-xl font-semibold shadow-md rounded-xl bg-white h-15 w-full"
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
          <div className=" w-full flex justify-end transition-all pl-5 mt-5">
            <button
              onClick={() => Login()}
              className="cursor-pointer bg-yellow-300 rounded-s-2xl w-1/2 p-4 text-left text-lg hover:w-full transition-all duration-500 delay-50 font-semibold"
            >
              Log In
            </button>
            <div className=" cursor-pointer bg-yellow-300 flex items-center px-5">
              <ArrowRightCircle size={30} />
            </div>
          </div>
        </main>
        <footer className="flex mt-20 items-center justify-center hover:text-xl transition-all cursor-pointer">
          Forgot Password?
        </footer>
      </div>
    </>
  );
};

export default Login;
