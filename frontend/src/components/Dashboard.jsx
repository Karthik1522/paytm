import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Appbar} from "./Appbar"
import { Balance } from "./Balance"
import { Users } from "./Users"
import axios from "axios";
export function Dashboard(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [user ,setUser] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
    
          axios
            .get("http://localhost:3000/me", {
              headers: { Authorization: "Bearer " + token },
            })
            .then((response) => {
              if (response.status === 200) {
                setUser(response.data.userId);
                setName(response.data.name);
              }
            })
            .catch((error) => {
              navigate("/signin");
              console.log("Not authenticated:", error.message);
            });
      }, [navigate]);
    return <>
    <Appbar name={name}/>
    <Balance></Balance>
    <Users currentUser = {user}></Users>
    
    </>
}