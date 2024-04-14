import { useState } from "react";
import { Link } from "react-router-dom";

import "./SingleActivity.css";

function SingleActivity(props)
{
  const [hover,setHover] = useState(false);

  function handleMouseEnter()
  {
    setHover(true);
  }

  function handleMouseLeave()
  {
    setHover(false);
  }

  const lineColorClass = props.sLine.split(" ")[1] === "owe" ? "owe" : "receive";
  return (
     <div className="single-activity"
      key={props.id} id={props.id} 
    onMouseEnter={handleMouseEnter}
     onMouseLeave={handleMouseLeave}
     >
      <Link to={`/split/${props.id}`} >
        <p className="activity-line">{props.fLine}</p>
        <p className={`activity-line ${lineColorClass}`}>{props.sLine}</p>
        <p className="activity-line">{props.time}</p>
        </Link>
     </div>
  )
}

export default SingleActivity;