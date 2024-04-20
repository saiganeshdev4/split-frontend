import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AddSplit.css";
import { url_for_backend } from "../../index.js";


function  AddSplit(props)
{
    const [firstPickListOptions,setFirstPickListOptions] = new useState([]);
    const [firstDropListValue, setfirstDropListValue] = useState('');
    const [secondPickListOptions, setSecondPickListOptions] = useState([]);
    const [isLoading,setIsLoading] = new useState(true);
    const [splitName, setSplitName] = new useState("");
    const [totalMoney,setTotalMoney] = new useState(0);
    const [moneyError,setMoneyError] = useState("");
    const [afterFormSubmit,setAfterFormSubmit] = new useState(false);
    const navigate = useNavigate();
    var error_occurred=false;

    // Define options for the second picklist based on the selected value of the first picklist
    async function getSecondPickListOptions(firstDropListValue){
      const result = await axios.get(url_for_backend+`/group/${firstDropListValue}`);
      var modified_result = ["You"];
      result.data.group_members.forEach((ele)=> ele!==props.currentUser && modified_result.push(ele) );
      return modified_result;
   };
// Handle change in the first picklist
async function handleFirstPickListChange (value) {
  setIsLoading(true);
  setfirstDropListValue(value);
  const options = await getSecondPickListOptions(value);
  setSecondPickListOptions(options);
  setSplitName("");
  setTotalMoney(0);
  setIsLoading(false);
  
};
    useEffect(()=>{
        async function getData()
        {
            var result = await axios.get(url_for_backend+`/listOfGroups/${props.currentUser}`);
            setFirstPickListOptions(result.data);
            if(result.data.length)
            await handleFirstPickListChange(result.data[0]);
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
    var string_with_money = truncateUptoTwoDecimals(inputValues[user_list_without_current_user[0]]);
    user_list_without_current_user.forEach((ele,ind)=>{
      if(ind!==0)
      {
      string_with_user+=";"+ele;
      string_with_money+=";"+truncateUptoTwoDecimals(inputValues[ele]);
      }
    })
    
 // console.log(e.target.group_name.value,props.currentUser,string_with_money,string_with_user,e.target.split_name.value,totalMoney);
  const body ={
    group_name: e.target.group_name.value,
    sender : props.currentUser,
    usersList : string_with_user,
    moneyList : string_with_money,
    split_name : e.target.split_name.value,
    total_money: totalMoney,
};
console.log(body);
    try{
    const result=await axios.post(url_for_backend+"/add/split/new",body);  
    
    }
    catch(err)
    {  error_occurred=true;
      console.log(err);
    }
    setAfterFormSubmit(true);
   }
  
    
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValues, setInputValues] = useState({});
  useEffect(()=>{
    setInputValues({});
    setSelectedOptions([]);
  },
  [firstDropListValue]);

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
  // truncates float upto 2 decimals and returns float in string format.
  function truncateUptoTwoDecimals(num)
  { // returns string
    return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  }
  function divideTotalMoneyAmongSelectedUsersOnly()
  {    var numberOfSelectedPeople= selectedOptions.length;
      var newInputValues = inputValues;
     if(numberOfSelectedPeople >0){
      selectedOptions.forEach((ele)=>{
        newInputValues[ele]=parseFloat(truncateUptoTwoDecimals(totalMoney/numberOfSelectedPeople));
      })
      
      setInputValues({...newInputValues});
    }
  }
    return ( afterFormSubmit ? 
    (<div className="add-split-container"><p className="success-message"> {error_occurred ? "Error occurred" : "Split has added successfully"} </p> <button className="form-button" onClick={()=>{navigate("/");}}> Go Home</button></div>)
     :
     isLoading ? 
        <p className="loading-message"> Loading........</p>
        :
        firstPickListOptions.length>0 ?
        <div className="add-split-container">
          <h2 className="expense-heading">Add Expense</h2>

          <form onSubmit={handleFormSubmit}>
          <label htmlFor="firstPickList" className="form-label">Group Name:</label>
          <select
            className="form-select"
            id="firstPickList"
            value={firstDropListValue}
            name="group_name"
            onChange={async(e) => await handleFirstPickListChange(e.target.value)}
          >
            {firstPickListOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label className="form-label">
            Expense Name:
            </label>
                <input
                  className="form-input"
                  type="text"
                  name="split_name"
                  value={splitName}
                  onChange={(e) => setSplitName(e.target.value)}
                  required
                />
         

          <label className="form-label">
            Total Money Added by You:
            </label>
                <input
                  className="form-input"
                  type="number"
                  name="total_money"
                  value={totalMoney}
                  onChange={(e) => setTotalMoney(e.target.value)}
                  onWheel={numberInputOnWheelPreventChange}
                  min="1"
                  required
                />
          
          <br />
          {secondPickListOptions.map((option) => (
            <div key={option}>
              <label className="form-label">
                <input
                  type="checkbox"
                  onChange={() => handleOptionChange(option)}
                  checked={selectedOptions.includes(option)}
                />
                {option}
              </label>
              {selectedOptions.includes(option) &&
              <input
                className="form-input"
                type="number"
                placeholder={`Enter how much ${option} ${(option==="You" ? " owe" :" owes")}`}
                value={inputValues[option] || ''}
                onChange={(e) => handleTextChange(option, e.target.value)}
                onWheel={numberInputOnWheelPreventChange}
                min="1"
                required
              />}
              
            </div>
          ))}
          {moneyError!=="" && <p>{moneyError}</p>}
          <button type="button" onClick={SelectAllUsersInGroup} className="form-button"> Select All Users</button>
          <button type="button" onClick={divideTotalMoneyAmongSelectedUsersOnly} className="form-button"> Divide equally</button>
          <button type="submit" className="form-button" >Submit</button>

          </form>
          
        </div>
        :
        <div className="add-split-container">
        <p>{"You are not part of any group yet, create a group to add split :)"}</p>
        </div>
    );
  
    

}

export default AddSplit;