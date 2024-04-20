import { useState,useEffect } from "react";
import axios from "axios";
import SingleActivity from "./SingleActivity";

import "./Activities.css";
import { url_for_backend } from "../../index.js";

function Activities(props)
{
    const [data,setData] = new useState([]);
    const [isLoading,setIsLoading] = new useState(true);

    useEffect(()=>{
        async function getData()
        {
           const result = await axios.get(url_for_backend+`/activity/${props.currentUser}`);
           setData(result.data);
           setIsLoading(false);
        }
        getData();
    },[]);

    return(
      <div className="activities-container">
         { isLoading ? <p className="loading-message">Loading....</p> :

         data.length >0 ?
            data.map((ele) =>
                 <SingleActivity key={ele.split_id} id={ele.split_id} fLine={ele.firstLine} sLine={ele.secondLine} time={ele.split_time} />
            )
            :
            <p className="no-split-message">{"You are not involved in any split yet!"}</p>
         }
      </div>   
    );

}

export default Activities;