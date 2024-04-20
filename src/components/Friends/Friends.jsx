import { useState,useEffect } from "react";
import axios from "axios";
import SingleFriendEntry from "./SingleFriendEntry";

import "./Friends.css";
import { url_for_backend } from "../../index.js";

function Friends(props)
{
    const [data,setData] = new useState([]);
    const [isLoading,SetIsLoading] = new useState(true);

    useEffect(()=>{
        async function getData()
        {
            const result = await axios.get(url_for_backend+`/friends/${props.currentUser}`);
            setData(result.data);
            SetIsLoading(false);
        }
        getData();

    },[]);

    return (
        <div className="friends-container">
        {isLoading ? <p className="loading-message">Loading....</p> :
        data.length > 0 ?
            data.map((ele,ind)=> 
               <SingleFriendEntry key={ind} id={ind} user={ele.user} money={ele.money}/>
            )
            :
            <p>{"You are not involved in any split yet!"}</p>
        }
        </div>
    );
}

export default Friends;