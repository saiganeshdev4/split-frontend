import axios from "axios";
import {useState,useEffect} from "react";
import SingileGroup from './SingleGroup';

import "./Groups.css";

function Groups(props){
    
    const [data,setData] = new useState([]);
    const [isLoading,SetIsLoading] = new useState(true);
    useEffect(()=>{
      async function getData()
      {
        const result = await axios.get(`http://localhost:4000/groups/${props.currentUser}`);
        setData(result.data);
        SetIsLoading(false);
      }
      getData();
    },[]);
  
    return ( <div className="groups-container"> {isLoading ? <p>Loading........</p> :
      
        data.length > 0 ?
        data.map((ele,ind)=>
         <SingileGroup key={ind} id={ind} groupName={ele.groupName} msg={ele.msg} owe_list={ele.owe_list} />
        )
        :
      <p>{"You are not part of any group, you can create a new group :)"}</p>
    }
      </div>
    );
}

export default Groups;