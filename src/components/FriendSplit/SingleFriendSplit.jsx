import { useState } from "react";
import { Link } from "react-router-dom";

import "./SingleFriendSplit.css";

function SingleFriendSplit(props)
{
     const [hover,setHover] = new useState(false);

    var color = props.ele.secondLine.split(" ")[1]==="lent" ? 'green' : 'red';
   function handleMouseEnter()
   {
    setHover(true);
   }

   function handleMouseLeave()
   {
    setHover(false);
   }
   return (
      <div
       className={`single-friend-split ${hover ? 'hover' : ''}`}
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
       >
        <Link to={`/split/${props.ele.split_id}`} className="split-link">
           <p className="split-name" >{props.ele.split_name}</p>
           <p className="split-line" >{props.ele.firstLine}</p>
           <p className={`split-line ${color}`}>{props.ele.secondLine}</p>
           <p className="split-time">{props.ele.split_time}</p>

        </Link>
      </div>
   );
}

export default SingleFriendSplit;