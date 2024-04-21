import { useState,useEffect } from "react";
import App from "../../App";
import axios from "axios";
import bcryptjs from "bcryptjs";
import "./RegisterLogin.css";

import { url_for_backend } from "../../index.js";

function RegisterLogin(props)
{   const [user,setUser] = new useState(() => {
    const storedValue = localStorage.getItem('user_name');
    return storedValue !== null ? storedValue : "";
  });
  const [afterLogin,setAfterLogin] = new useState(()=>{
    var storedValue = localStorage.getItem('afterLogin');
    return storedValue === "true";
  });
    const [password,setPassword] = new useState("");
    const [confirmP,setConfirmP] = new useState("");
    const [isRegister,setIsRegister] = new useState(true);
    const [passwordError,setPasswordError] = new useState("");
    const [usernameError,setUsernameError] = new useState("");
    const [loginError,setLoginError] = new useState("");
    const [data,setData] = new useState([]);
    const [isLoading,setIsLoading] = new useState(true);
    
    useEffect(()=>{

        async function getData()
        {
           const result = await axios.get(url_for_backend+"/AllUsers");
           setData(result.data);
           setIsLoading(false);
        }
        getData();
    },[]);
    function handleUsername(event)
    {     setUser(event.target.value);
        if(isRegister && event.target.value && data.includes(event.target.value))
        {
         setUsernameError("User name is already taken by someone else");
        }
        else
        setUsernameError("");
    }
    async function handleSubmit(event)
    {         event.preventDefault();
              console.log(event.target);
              if(passwordError==="" && usernameError==="")
                {  
                    
                    var body= {user_name:user};
                    if(isRegister)
                    {  
                        bcryptjs.hash(password,10, async (err,hash)=>{

                            if(err)
                            {
                                console.log("Error in hashing password: ",err);
                                return;
                            }
                           body={...body,acc_password:hash};
                           
                        const result = await axios.post(url_for_backend+"/add/user",body);
                        setAfterLogin(true);
                        localStorage.setItem('user_name',body.user_name);
                        localStorage.setItem('afterLogin',"true");
                         });
                    }
                    else
                    {
                      const result = await axios.get(url_for_backend+`/credentials?user_name=${user}`);

                      if(result.data.error)
                      {
                        setLoginError(result.data.error); // happens when user_name is not present in db
                      }
                      else
                      {
                        bcryptjs.compare(password,result.data.password,(err,res)=>{
                            if(err)
                            {
                                console.log("Error in Comparing passwords: ",err);
                            }
                            if(res)
                            {
                                setAfterLogin(true);
                                localStorage.setItem('user_name',body.user_name);
                                localStorage.setItem('afterLogin',"true");
                            }
                            else
                            {
                                setLoginError("Invalid Credentials"); // happens when passwords doesn't match but the user exists in db 
                            }
                        });
                      }
                    }
                    
                }
    }
    function handlePassword(event)
    {   
        setPassword(event.target.value);
        if(isRegister && confirmP!=="" && confirmP!==event.target.value)
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
    function init()
    {
        setUser("");
        setPassword("");
        setConfirmP("");
        setPasswordError("");
        setUsernameError("");
        setLoginError("");

    }
    function renderLogin()
    {
        if(isRegister)
        {
            setIsRegister(false);
            init();
        }
    }
    function renderRegister()
    {
        if(!isRegister)
        {
            setIsRegister(true);
            init();
        }
    }
    return isLoading ?
    <div className="register-login-container"> <p className="loading-message">Loading.......</p> </div> : 
    
    afterLogin ? 
    <App currentUser={user} setAfterLogin={setAfterLogin} init={init} setIsRegister={setIsRegister}/> 
      
      :
      <div className="register-login-container">
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                 <div>
                    <label>User Name: </label>
                    <input
                        type={"text"}
                        name={"user_name"}
                        placeholder={"Enter User Name"}
                        onChange={handleUsername}
                        value={user}
                        required
                    />
                    {usernameError!=="" && <p>{usernameError}</p>}
                </div>
                <div>
                    <label> Password: </label>
                    <input type={"password"}
                        name={"password"}
                        placeholder={"enter password"}
                        value={password}
                        onChange={handlePassword}
                        required
                    />
                {!isRegister && loginError!=="" && <p>{loginError}</p>}
                </div>
                {isRegister && 
                <div>
                    <label> Confirm Password: </label>
                    <input type={"password"}
                        name={"confirm_password"}
                        placeholder={"enter password"}
                        value={confirmP}
                        onChange={handleConfirmPassword}
                        required
                    />
                    {passwordError!=="" &&<p>{passwordError}</p>}
                </div>}
                <button type="submit"> Submit </button>
             {  isRegister && <button type="button" onClick={renderLogin}>Login</button> }
              { !isRegister &&  <button type="button" onClick={renderRegister}>Register</button> }
            </form>
       </div>    
    ;
}

export default RegisterLogin;