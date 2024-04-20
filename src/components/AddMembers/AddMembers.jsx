
import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import "./AddMembers.css";
import { url_for_backend } from "../../index.js";

function AddMembers(props)
{
     const [usersWhoAreNotInGroup,setUsersWhoAreNotInGroup] = new useState([]);
     const [isLoading,setIsLoading] = new useState(true);
     const {group_name} = useParams();

     const [selectedOptions,setSelectedOptions]= new useState([]);
     const [afterFormSubmit, setAfterFormSubmit] = new useState(false);
     const navigate = useNavigate();
    useEffect(()=>{

        async function getData()
        {
             const result = await axios.get(url_for_backend+`/listOfUsersNotPresentInGroup/${group_name}`);
             var list_of_users = [];
         result.data.forEach((ele)=>{
            list_of_users.push({value:ele,label:ele});
        });
            setUsersWhoAreNotInGroup(list_of_users);
            setIsLoading(false);

        }
        getData();
    },[]);

    console.log(usersWhoAreNotInGroup);
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
        const result = await axios.put(url_for_backend+`/addMembers/${group_name}`,{
            group_members: string_with_selected_users
        });
        

                console.log(result.data);
            }
            catch(err)
            {   
                console.log(err);
            }
            setAfterFormSubmit(true);
    }
    return afterFormSubmit ?
            <div className="add-members-container">
               <p className="success-message" >Added members successfully</p>
               <button className="form-button" onClick={()=>{navigate("/")}}>
                Go Home
               </button>
            </div>
            :
            isLoading ? 
                <p className="loading-message" >Loading........</p>
                :
                <div className="add-members-container">
                    <h1>{group_name}</h1>
                    <h2> Add new members to group</h2>
                    <form onSubmit={handleFormSubmit}>
                        <Select
                        isMulti
                        name="users"
                        options={usersWhoAreNotInGroup}
                        isSearchable={true}
                        onChange={setSelectedOptions}
                        required
                        />
                        <br/>
                    <button className="form-button"  type="submit">Submit</button>
                    </form>
                </div>;
}

export default AddMembers;