import { useState,useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { url_for_backend } from "../../index.js";
import "./EditSplit.css";
// known bugs
//  1. make sure sum of money owed by everyone and totalMoney are equal.


function  EditSplit(props)
{
    const [secondPickListOptions, setSecondPickListOptions] = useState([]);
    const [isLoading,setIsLoading] = new useState(true);
    const [splitName, setSplitName] = new useState("");
    const [totalMoney,setTotalMoney] = new useState(0);
    const [afterFormSubmit,setAfterFormSubmit] = new useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [moneyError,setMoneyError] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();
    const location = useLocation();
    const group_name = new URLSearchParams(location.search).get('group_name');
    var error_occurred=false;
    useEffect(()=>{
        async function getData()
        {  
            var result = await axios.get(url_for_backend+`/split/${id}?current_user=${props.currentUser}`);
            setSplitName(result.data.split_name);
            setTotalMoney(parseInt(result.data.fourthLine.split(" ")[2]));
            var selected=[];
            var input={};
            result.data.restOfSplit.forEach((ele)=>{
                var temp = ele.payment.split(" ");
                selected.push(temp[0]);
                input[temp[0]] = parseFloat(temp[2]);
            });
            setSelectedOptions(selected);
            setInputValues({...input});
            
            // get group members for the group
            var result_1 = await axios.get(url_for_backend+`/group/${group_name}`);
            var modified_result = ["You"];
            result_1.data.group_members.forEach((ele)=> ele!==props.currentUser && modified_result.push(ele) );
            setSecondPickListOptions(modified_result);
        
            setIsLoading(false);
        }
        getData();
    },[]);

    async function handleFormSubmit(e)
    {
    e.preventDefault();
    var money_list=Object.values(inputValues);
    var sum_of_money=0;
    money_list.forEach((ele)=>{
      if(ele)
      sum_of_money+=parseFloat(ele);
    })
    // show alert if money is not equal note. in some case sum won't be equal ex: 1 person added split for 3 ppl and paid 100, now money owed by each user is 33.333 and sum of money is 99.999 which is not equal to 100
    if(totalMoney<sum_of_money || totalMoney-sum_of_money >= 0.1)  // 0<= totalMoney-sum_of_money<0.1 is correct range.
    {  // sum of money is not equals to total money
            setMoneyError("Total money is not equal to sum of money others owe you");
            return ;
    }
    else
    {
      setMoneyError("");
    }
    var user_list_without_current_user=selectedOptions.filter((ele)=>{return ele!=="You"; })
    var string_with_user=user_list_without_current_user[0];
    var string_with_money = inputValues[user_list_without_current_user[0]].toString();
    user_list_without_current_user.forEach((ele,ind)=>{
      if(ind!==0)
      {
      string_with_user+=";"+ele;
      string_with_money+=";"+inputValues[ele];
      }
    })
    
 // console.log(e.target.group_name.value,props.currentUser,string_with_money,string_with_user,e.target.split_name.value,totalMoney);
  const body ={
    group_name: group_name,
    sender : props.currentUser,
    usersList : string_with_user,
    moneyList : string_with_money,
    split_name : e.target.split_name.value,
    total_money: totalMoney,
};
console.log(body);
    try{
    const result=await axios.put(url_for_backend+`/edit/split/${id}`,body);  
    
    }
    catch(err)
    {  error_occurred=true;
      console.log(err);
    }
    setAfterFormSubmit(true);
    }

  // Handle checkbox change
  const handleOptionChange = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      setInputValues({
        ...inputValues,
        [option]:'',
      });
  };

  const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur()

    // Prevent the page/container scrolling
    e.stopPropagation()

    // Refocus immediately, on the next tick (after the current     
    // function is done)
      setTimeout(() => {
        e.target.focus()
    }, 0)
}

  // Handle text input change
  const handleTextChange = (option, text) => {
    setInputValues({
      ...inputValues,
      [option]: text,
    });
  };

  function SelectAllUsersInGroup ()
  {  
     if(selectedOptions.length === secondPickListOptions.length)
    setSelectedOptions([]);
    else
    setSelectedOptions(secondPickListOptions);
  var newInputValues=[];
  secondPickListOptions.forEach((ele)=>{
      newInputValues[ele]='';
    })
    
    setInputValues({...newInputValues});
  }
  function divideTotalMoneyAmongSelectedUsersOnly()
  {    var numberOfSelectedPeople= selectedOptions.length;
      var newInputValues = inputValues;
     if(numberOfSelectedPeople >0){
      selectedOptions.forEach((ele)=>{
        newInputValues[ele]=totalMoney/numberOfSelectedPeople;
      })
      
      setInputValues({...newInputValues});
    }
  }
    return ( afterFormSubmit ? 
    (<div className="message-container">
    <p className="message">
     {error_occurred ? "Error occurred" : "Split has been modified successfully"} </p> 
     <button className="button" onClick={()=>{navigate("/");}}> Go Home</button></div>)
     :
     isLoading ? 
        <p className="loading-message"> Loading........</p>
        :
        <div className="edit-split-container">
          <h2 className="heading">Add Expense</h2>

          <form onSubmit={handleFormSubmit}>
          <label className="label" htmlFor="firstPickList">Group Name: {group_name}</label> 
          <label className="label">
            Expense Name:
                <input
                  className="input"
                  type="text"
                  name="split_name"
                  value={splitName}
                  onChange={(e) => setSplitName(e.target.value)}
                  required
                />
          </label>
          <label className="label">
            Total Money Added by You:
                <input
                  className="input"
                  type="number"
                  name="total_money"
                  value={totalMoney}
                  onChange={(e) => setTotalMoney(e.target.value)}
                  onWheel={numberInputOnWheelPreventChange}
                  min="0.01"
                  step="0.01"
                />
          </label>
          <br />
          {secondPickListOptions.map((option) => (
            <div  className="checkbox-container" key={option}>
              <label className="label">
                <input
                  type="checkbox"
                  onChange={() => handleOptionChange(option)}
                  checked={selectedOptions.includes(option)}
                />
                {option}
              </label>
              {selectedOptions.includes(option) &&
              <input
                className="input"
                type="number"
                placeholder={`Enter how much ${option} ${(option==="You" ? " owe" :" owes")}`}
                value={inputValues[option] || ''}
                onChange={(e) => handleTextChange(option, e.target.value)}
                onWheel={numberInputOnWheelPreventChange}
                min="0.01"
                step="0.01"
                required
              />}
              
            </div>
          ))}
          {moneyError!=="" && <p>{moneyError}</p>}
          <button type="button" onClick={SelectAllUsersInGroup} className="button"> Select All Users</button>
          <button type="button" onClick={divideTotalMoneyAmongSelectedUsersOnly} className="button"> Divide equally</button>
          <button type="submit"  className="button">Submit</button>

          </form>
          
        </div>
    );
  
    

}

export default EditSplit;