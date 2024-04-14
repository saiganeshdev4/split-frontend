import { useState,useEffect } from "react";
import { useParams,useNavigate,Link } from "react-router-dom";
import axios from "axios";

import "./Split.css";

function Split(props)
{
   const [data,setData] = new useState([]);
   const [isLoading,setIsLoading] = new useState(true);
   const [afterDelete,setAfterDelete] = new useState(false);
   var {id} = useParams();
  const navigate = useNavigate();
   useEffect(()=>{
    async function getData()
    {
      var result = await axios.get(`http://localhost:4000/split/${id}?current_user=${props.currentUser}`);
      setData(result.data);
      setIsLoading(false);
    }
    getData();
   },[]);

   async function handleDelete()
   {
         var result = await axios.delete(`http://localhost:4000/delete/split/${id}`);
         setAfterDelete(true);
   }

   return (
           afterDelete ? 
           <div className="split-deleted-container"> 
           <p>split has been deleted</p>
           <button onClick={()=>{navigate(-1);}}>Go back</button>
           </div>
            :
           isLoading ? <p>Loading....... </p>:
           <div className="split-info-container">
             <h2>{data.split_name}</h2>
             <h2>{data.group_name}</h2>
             <p>{data.thirdLine}</p>
             <p>{data.fourthLine}</p>
             {data.restOfSplit.map((ele,ind) => <p key={ind}>{ele.payment}</p>)}

             {data.fourthLine.split(" ")[0]==="You" &&  
               <div className="split-action-buttons">
             <Link to={`/editSplit/${id}?group_name=${data.group_name}`}><button>Edit Split</button></Link> 
             <button onClick={handleDelete}>Delete Split</button>
             </div>            
             }
           </div>
   );
}

export default Split;