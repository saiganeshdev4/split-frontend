import { useState } from "react";
import { Link } from "react-router-dom";

import "./SingleGroupInfoEntry.css";

function SingleGroupInfoEntry(props)
{  
     const [hover,setHover]= new useState(false);

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
            className= {`group-info-entry-container ${hover ? 'hover' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
              <Link to={`/split/${props.split_id}`} className="split-link">
                <p>{props.split_name}</p>
                <p>{props.paid}</p>
                <p>{props.msg}</p>
                <p>{props.split_time}</p>
             </Link>
             </div>
    );
}

export default SingleGroupInfoEntry;