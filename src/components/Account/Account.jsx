import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url_for_backend } from "../../index.js";
import "./Account.css";

function Account(props)
{   const [state,setState] = new useState("account");
    const [oldPassword,setOldPassword] = new useState("");
    const [password,setPassword] = new useState("");
    const [confirmP,setConfirmP] = new useState("");
    const [passwordError,setPasswordError] = new useState("");
    const [oldPasswordError,setOldPasswordError] = new useState("");
    const [msg,setMsg] = new useState("");
    const navigate = useNavigate();
    function init()
    {
        setState("account");
        setOldPassword("");
        setPassword("");
        setConfirmP("");
        setPasswordError("");
        setOldPasswordError("");
        setMsg("");
    }

    function handlePassword(event)
    {   
        setPassword(event.target.value);
        if(confirmP!=="" && confirmP!==event.target.value)
        setPasswordError("Passwords don't match");
        else
        setPasswordError("");
    }
    function handleConfirmPassword(event)
    {
        setConfirmP(event.target.value);
        if(event.target.value!==password)
            setPasswordError("Passwords don't match");
        else
        setPasswordError("");
    }

    async function handleDelete()
    {
        var result = await axios.get(url_for_backend+`/groups/${props.currentUser}`);

        var can_be_deleted = result.data.find((ele)=>ele.owe_list.length >0) === undefined;

        if(can_be_deleted)
        {
            result = await axios.delete(url_for_backend+`/delete/account/${props.currentUser}`);
            setMsg("Account has been deleted sucessfully!");
            setState("result");
        
        }
        else
        {
            setMsg("You should settle all the splits, before deleting account :)");
            setState("result");
        }
    }
    async function handleSubmit(event)
    {
        event.preventDefault();
        if(passwordError!=="")
        return;

        var result = await axios.post(url_for_backend+"/check/credentials",{user_name:props.currentUser,acc_password:oldPassword});
        if(result.data.msg==="valid credentials")
        {
          result = await axios.put(url_for_backend+"/updatePassword",{user_name:props.currentUser,acc_password:password});
          setMsg("password updated sucessfully");
          setState("result");
        }
        else
        {
          setOldPasswordError("Enter correct password!");
        }
    }
    return state === "account" ?
    <div className="account-container">
        <h2 className="account-title">Hola! {props.currentUser}</h2>
        <button type="button" onClick={()=>{setState("password")}}>change password</button>
        <button type="button" onClick={handleDelete}>delete account</button>
        <button type="button" onClick={()=>{  props.init();
                props.setIsRegister(false);
                props.setAfterLogin(false);
                localStorage.setItem('user_name',"");
                localStorage.setItem('afterLogin',"false");
                navigate("/");}}> logout </button>
    </div>
    : 
    state ==="password" ?
      <div className="account-container">
        <form className="password-form" onSubmit={handleSubmit}>
                 <div>
                    <label>Old Password: </label>
                    <input
                        type={"password"}
                        name={"old_password"}
                        placeholder={"Enter old password"}
                        onChange={(event)=>setOldPassword(event.target.value)}
                        value={oldPassword}
                    />
                </div>
                <div>
                    <label> Password: </label>
                    <input type={"password"}
                        name={"password"}
                        placeholder={"enter password"}
                        value={password}
                        onChange={handlePassword}
                    />
                </div>
                <div>
                    <label> Confirm Password: </label>
                    <input type={"password"}
                        name={"confirm_password"}
                        placeholder={"enter password"}
                        value={confirmP}
                        onChange={handleConfirmPassword}
                    />
                    {passwordError!=="" &&<p>{passwordError}</p>}
                    {oldPasswordError!=="" && <p>{oldPasswordError}</p>}
                </div>
                <button type="submit"> Submit </button>
                <button type="button" onClick={init}>Go back</button>
            </form>
      </div>
      :   // which means state = result
      <div className="account-container">
      <p  className="success-message">{msg}</p>
        <button onClick={()=>{
            if(msg.split(" ")[0]!=="Account")
            {   
                init();
                navigate("/account");
            }
            else  // account deleted
            {   props.init();
                props.setIsRegister(true);
                props.setAfterLogin(false);
                localStorage.setItem('user_name',"");
                localStorage.setItem('afterLogin',"false");
                navigate("/");
            }
        }}>{msg.split(" ")[0]!=="Account" ? "Go Back" : "Go to Register Page"}</button>
      </div>
    ;
}

export default Account;