import { useState,useEffect} from "react";
import {useParams } from 'react-router-dom';
import axios from "axios";
import SingleGroupInfoEntry from "./SingleGroupInfoEntry";
import { Link } from "react-router-dom";

import "./GroupInfo.css";
import { url_for_backend } from "../../index.js";

function GroupInfo(props)
{
    const [data,setData] = new useState([]);
    const [isLoading,setIsLoading] = new useState(true);
    const {id} = useParams();
    var show_settle_up = true;
    useEffect(()=>{
        async function getData()
        {
             const result = await axios.get(url_for_backend+`/group/split/${id}?current_user=${props.currentUser}`);
             setData(result.data);
             setIsLoading(false);
        }
        getData();
    },[]);

    return <div className="group-info-container">
       { isLoading ? <p>Loading.....</p> 
            :
           <div>
           <h1>{data.group_name}</h1>
           
           {data.part_one.map((ele,ind) =>
           {    var color = ele.split(" ")[1]==="owe" ? 'red' : 'green';
               return <p key={ind} style={{color : color}}>{ele}</p> ;
           }
           )}
           
           {/* {(data.part_one[0].split(" ")[1].slice(0,3) ==="owe")&& <button className="settle-up-button"> settle up</button> } */}
           <Link to={`/groupData/${id}?leave_grp=${!(data.part_one[0].split(" ")[1].slice(0,3) ==="owe")}`}> <button  className="group-info-button">Group Info</button> </Link>
           {
            data.part_two.map((ele,ind)=>
             <SingleGroupInfoEntry key={ind} split_id={ele.split_id} split_name={ele.split_name}
                paid={ele.paid}
                msg={ele.msg}
                split_time={ele.split_time}
             />
            )}
          </div>
        }
    </div>
}

export default GroupInfo;