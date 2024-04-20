
import { useEffect,useState } from "react";
import axios from "axios";
import { useParams,Link,useLocation,useNavigate } from "react-router-dom";

import "./GroupData.css";
import { url_for_backend } from "../../index.js";

function GroupData(props)
{
    const[data,setData]= new useState([]);
    const[isLoading,setIsLoading] =new useState(true);
    const[afterLeaveGrp,setAfterLeaveGrp] = new useState(false);
    var {group_name}= useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const leave_grp = new URLSearchParams(location.search).get('leave_grp')==='true';
    
    useEffect(()=>{
        async function getData()
        {
            var result = await axios.get(url_for_backend+`/group/${group_name}`);
            setData(result.data);
            setIsLoading(false);
        }
        getData();
    },[]);

    async function handleClick(event)
    {
        if(leave_grp)
        {
            var result =await axios.delete(url_for_backend+`/removeMember/${group_name}?currentUser=${props.currentUser}`);
        }
        setAfterLeaveGrp(true);
    }

return  <div className="group-data-container">
      {afterLeaveGrp ? 
          <div className="leave-group-message">
            <p>{leave_grp ? "You have been removed from the group" :"You can't leave the group when you are not settled :)"}</p>
            <button onClick={()=>{leave_grp ? navigate("/") : setAfterLeaveGrp(false);}}>
                {leave_grp ? "Go Home" : "Go back"}
            </button>
          </div>
      
        :
        isLoading ? 
        <p className="loading-message">Loading.......</p> 
        :
        <div>
            <h1>{group_name}</h1>
            <h2>Created by : {data.group_creator===props.currentUser ? "You" : data.group_creator}</h2>
            <h3>Group members:</h3>
            {data.group_members.map((ele,id) =>{
                return <p key={id}>{ele===props.currentUser ? "You" : ele}</p>;
            })
            }
            <Link to={`/addMembers/${group_name}`}>
                <button className="add-members-button">
                    Add members
                </button>
            </Link>

                <button className="leave-group-button" onClick={handleClick}>
                    Leave group
                </button>
            
        </div>
      }
      </div>
}

export default GroupData;