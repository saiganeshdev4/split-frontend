import {useState} from "react";
import { Link } from "react-router-dom";

import "./SingleGroup.css";

function SingleGroupInfo(props)
{   var str= props.msg.split(" ")[1];
    var temp= str==="expense" ? "lightblue" : (str==="owe" ? "red" : "green");
    const [hover, setHover] = useState(false);

    const handleMouseEnter = () => {
      setHover(true);
    };
  
    const handleMouseLeave = () => {
      setHover(false);
    };
     var link = "/groups/"+props.groupName;
    return ( 
    <div 
    className={`single-group ${hover ? 'hover' : ''}`}
    key={props.id}     
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>
       <Link to={link} className="group-link"> 
       <h2 className="group-name" >{props.groupName}</h2> 
       <h3 className={`group-msg ${temp}`}>{props.msg}</h3>
       {props.owe_list.map((ele,ind)=><h4 key={ind} className="owe-list-item">{ele}</h4>)}
       </Link>
    </div>
    );
}

export default SingleGroupInfo;