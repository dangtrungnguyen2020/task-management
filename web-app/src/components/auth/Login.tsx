import React, { useEffect, useState } from "react";
import Registration from "./Registration";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import authApi from "../../apis/AuthApi";
import { toast } from "react-toastify";
import { setUser } from "../../redux/userSlice";
import { AppDispatch, RootState } from "../../redux/store"; // Assuming you have these types
import UserCredential from "../../domain/dto/UserCredential";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();

  const [openRegisterForm, setOpenRegisterForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      navigate("/projects");
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response: UserCredential = await authApi.loginWithApi(
        email,
        password
      );
      console.log("response", response);
      if (response && response?.accessToken) {
        authApi.getUserInfo().then((userInfo) => {
          dispatch(setUser(userInfo));
        });
        toast.success("Login successful! Redirecting...");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 py-10">
      {!id ? (
        <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
          {openRegisterForm ? (
            <Registration
              openRegisterForm={openRegisterForm}
              setOpenRegisterForm={setOpenRegisterForm}
            />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>Don't have an account?</p>
                <button
                  onClick={() => setOpenRegisterForm(true)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Register Here
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>Welcome back!</div>
      )}
    </div>
  );
};

export default Login;
