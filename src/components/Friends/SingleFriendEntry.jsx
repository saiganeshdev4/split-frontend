import {useState} from "react";
import { Link } from "react-router-dom";

import "./SingleFriendEntry.css";

function SingleFriendEntry(props)
{

    const [hover,setHover]= new useState(false);
    var text = props.money===0 ?
    "settled" :
    (props.money > 0 ? "owes you " : "you owe ") + Math.abs(props.money) ;
    
    function handleMouseEnter()
    {
       setHover(true);
    }

    function handleMouseLeave()
    {
        setHover(false);
    }

return (<div key={props.id}  className={`friend-entry ${hover ? 'hover' : ''}`} 
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}> 
         <Link to={`/friends/${props.user}`} className="friend-link">
        <p className="friend-name">{props.user}</p>
        <p className={`friend-money ${props.money >= 0 ? 'positive' : 'negative'}`}>{text}</p>
        </Link>
        </div>);
}

export default SingleFriendEntry;