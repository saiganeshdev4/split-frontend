import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import "./AddGroup.css"
import { url_for_backend } from "../../index.js";

function AddGroup(props)
{  
    const [groupName,setGroupName] = new useState("");
    const [data,setData] = new useState([]);
    const [isLoading,setIsLoading] = new useState(true);
    const [selectedOptions,setSelectedOptions]= new useState([]);
    const [afterFormSubmit, setAfterFormSubmit] = new useState(false);
    const [isError, setIsError] = new useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
       async function getData()
       {
         const result = await axios.get(url_for_backend+"/AllUsers");
         var list_of_users = [];
         result.data.forEach((ele)=>{
            if(ele!==props.currentUser)
            list_of_users.push({value:ele,label:ele});
        });
         setData(list_of_users);
         setIsLoading(false);
       }
       getData();
    },[]);

     async function handleFormSubmit(event)
    {  
        try{
                    event.preventDefault();
            var list_of_selected_users= selectedOptions.map((ele)=>ele.value);
            var string_with_selected_users = list_of_selected_users[0];
            list_of_selected_users.forEach((ele,ind)=>{
                if(ind>0)
                {
                    string_with_selected_users+=","+ele;
                }
            })
            const result = await axios.post(url_for_backend+`/add/group/${props.currentUser}`,{
                group_name:event.target.group_name.value,
                group_members: string_with_selected_users
            });
            

            console.log(result.data);
        }
        catch(err)
        {   setIsError(true);
            console.log(err);
        }
        setAfterFormSubmit(true);
    }
    function handleClick()
    {   if(isError)
        {navigate("/addGroup");
        setGroupName("");
         setAfterFormSubmit(false);
         setIsError(false);
        }
        else
        {
          navigate("/");
        }
    }
    return(  afterFormSubmit ? 
    <div className="add-group-container"> 
        {isError ? <p className="error-message">Group Name has already exist. Please try with another name</p> : <p className="success-message">Group has created successfully</p> }
        <button className="form-button" onClick={handleClick}>
        {isError? "Go back" : "Go Home"}
        </button>
    </div> 
    : 
    isLoading ? <p className="loading-message">Loading........</p> :
   <form className="add-group-container" onSubmit={handleFormSubmit}>
    <label className="form-label">
        Group Name:
        <input
            type="text"
            name="group_name"
            value={groupName}
            onChange={(e)=>{setGroupName(e.target.value)}}
        />
    </label>
    <br/>
    <label className="form-label" >Select group members. <br/> You and </label>
    <Select
    isMulti
    name="users"
    options={data}
    isSearchable={true}
    onChange={setSelectedOptions}
    styles={{} }
  />
  <br/>
  <button  className="form-button" type="submit">Submit</button>
   </form>);
}

export default AddGroup;