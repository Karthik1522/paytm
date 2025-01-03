import axios from "axios"
import { useEffect, useState } from "react"

export const Balance = () => {
    const [balance, setBalance] = useState(0);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/account/balance",{
            headers: { Authorization: "Bearer " + token },
          })
          .then(function(res){
            setBalance(res.data.balance);
          })
    },[balance])
    return <div className="pt-4 flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}