import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  SuccessModal  from "../components/SuccessModal"
import ErrorModal from "./ErrorModal";


export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const firstName = searchParams.get("name");
    const id = searchParams.get("id");

    const [navigateToDashboard, setNavigateToDashboard] = useState(false);
    const [isOpen, setModalOpen] = useState(false);
    const [isError, setErrorOpen] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (navigateToDashboard) {
          navigate("/dashboard");
        }
      }, [navigateToDashboard, navigate]);


    const [amount,setAmount] = useState(0);

    function sendMoney() {
        const token = localStorage.getItem("token");
    
        axios.post("http://localhost:3000/account/transfer", {
            to: String(id),
            amount: Number(amount)
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(function (response) {
            setMessage(response.data.message);
            setModalOpen(true);
        })
        .catch(function (err) {
            console.log("Error:", err.response?.data || err.message);
            setErrorOpen(true);
        });
    }
    

    return <> 
    <SuccessModal isOpen={isOpen} onClose={() => {setModalOpen(false); setNavigateToDashboard(true);}} message={message} />
    <ErrorModal isOpen={isError} onClose={()=>{setErrorOpen(false)}} message={message}/>
    <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
            >
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-2xl text-white">{firstName[0].toUpperCase()}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{firstName}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="amount"
                    >
                        Amount (in Rs)
                    </label>
                    <input
                        type="number"
                        onChange={(e)=>{
                            setAmount(e.target.value);
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        placeholder="Enter amount"
                    />
                    </div>
                    <button onClick={sendMoney}className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Initiate Transfer
                    </button>
                </div>
                </div>
        </div>
      </div>
    </div></>
}