import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SingleFriendSplit from "./SingleFriendSplit";

import "./FriendSplitHistory.css";

function FriendSplitHistory(props)
{
  const [data,setData] = new useState([]);
  const [isLoading,setIsLoading] = new useState(true);
  const {id} = useParams();
  useEffect(()=>{
    async function getData()
    {
        var result = await axios.get(`http://localhost:4000/filterByFriend?current_user=${props.currentUser}&friend=${id}`)
        setData(result.data);
        setIsLoading(false);
    }
    getData();
  },[]);

  return (
    isLoading ? <p>Loading......</p> :
    <div className="split-details-container">
        <h2>{id}</h2>
        {/* <button className="settle-up-button"> Settle Up</button> */}
        {data.map((ele,ind)=>
             <SingleFriendSplit  key={ind} ele={ele} />
        )}
    </div>
  );
}

export default FriendSplitHistory;