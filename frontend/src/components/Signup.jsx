import { useEffect, useRef, useState } from "react";
import  SuccessModal  from "../components/SuccessModal"
import ErrorModal from "./ErrorModal";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

export function Signup() {
    const firstName = useRef("");
    const lastName = useRef("");
    const username = useRef("");
    const password = useRef("");
    const navigate = useNavigate();
    
    const [navigateToDashboard, setNavigateToDashboard] = useState(false);
    const [isOpen, setModalOpen] = useState(false);
    const [isError, setErrorOpen] = useState(false);
    const [message, setMessage] = useState("");

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

    function createAccount() {
        fetch("http://localhost:3000/user/signUp", {
            method: "POST",
            body: JSON.stringify({
                username: username.current.value,  // Add `.value` to access the input value
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                password: password.current.value
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(async function(res) {
            const data = await res.json();
            setMessage(data.message); //modal message
            if(!res.ok){
                setErrorOpen(true);
                
                return;
            }
            else{
              setModalOpen(true);
              localStorage.setItem("token",data.token);
              return;
            }
        }).catch(function(error) {
            console.error("Error creating account:", error);
        });
    }
    
    
  return (
    <>  
        {/* SuccessModal */}
        <SuccessModal isOpen={isOpen} onClose={() => {setModalOpen(false); setNavigateToDashboard(true);}} message={message} />
        <ErrorModal isOpen={isError} onClose={()=>{setErrorOpen(false)}} message={message}/>
 
      <div className="flex items-center justify-center min-h-screen bg-gray-500">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your information to create an account
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();  // Prevent default form submission behavior
        }}>

            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="John"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref = {firstName}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref = {lastName}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref = {username}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                ref = {password}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                onClick={createAccount}
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link className="cursor-pointer text-blue-500 hover:underline" to='/signin'>Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}