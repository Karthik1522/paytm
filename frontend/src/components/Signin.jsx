import { useRef, useState, useEffect } from "react";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "./ErrorModal";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export function Signin() {
  const username = useRef("");
  const password = useRef("");
  const navigate = useNavigate();

  const [isOpen, setModalOpen] = useState(false);
  const [isError, setErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:3000/me", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          if (response.status === 200) {
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          console.log("Not authenticated:", error.message);
        });
    }
  }, [navigate]);


  useEffect(() => {
    if (navigateToDashboard) {
      navigate("/dashboard");
    }
  }, [navigateToDashboard, navigate]);

  async function login(event) {
    try {
      const res = await axios.post("http://localhost:3000/user/signIn", {
        username: username.current.value,
        password: password.current.value,
      });

      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token); 
      setModalOpen(true); 
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
      setErrorOpen(true);
    }
  }

  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={() => {
          setModalOpen(false); 
          setNavigateToDashboard(true); // Trigger navigation to dashboard
        }}
        message={message}
      />
      <ErrorModal
        isOpen={isError}
        onClose={() => {
          setErrorOpen(false);
        }}
        message={message}
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-500">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your credentials to access your account
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission behavior
            }}
          >
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref={username}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref={password}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
              onClick={login}
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              className="cursor-pointer text-blue-500 hover:underline"
              to="/signup"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
