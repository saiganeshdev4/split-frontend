import Groups from "./components/Group/Groups";
import Friends from "./components/Friends/Friends";
import Activities from "./components/Activities/Activities";
import GroupInfo from "./components/GroupInfo/GroupInfo";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Split from "./components/Split/Split";
import FriendSplitHistory from "./components/FriendSplit/FriendSplitHistory";
import AddSplit from "./components/AddSplit/AddSplit";
import AddGroup from "./components/AddGroup/AddGroup";
import GroupData from "./components/GroupData/GroupData";
import AddMembers from "./components/AddMembers/AddMembers";
import EditSplit from "./components/EditSplit/EditSplit";
import Account from "./components/Account/Account";
import Welcome from "./components/Welcome/Welcome";
function App(props) {
   /*
   2) store user name and afterLogin in local storage.
   3) Add more css
   */
 return (
  <div>
 <BrowserRouter>
 <Routes>
   <Route path="/" element={<Layout />}>
     <Route index element={<Welcome currentUser={props.currentUser}/>} />
     <Route path="groups" >
        <Route index element={<Groups currentUser={props.currentUser}/>}/>
        <Route path=":id" element={<GroupInfo currentUser={props.currentUser}/>}/>
     </Route>
     <Route path="friends" >
        <Route index element={<Friends currentUser={props.currentUser}/>}/>
        <Route path=":id" element={<FriendSplitHistory currentUser={props.currentUser}/>}/>

     </Route>
     <Route path="activities" element={<Activities currentUser={props.currentUser} />} />
     <Route path="split/:id" element={<Split currentUser={props.currentUser}/>} />
     <Route path="addSplit" element={<AddSplit currentUser={props.currentUser}/>} />
     <Route path="addGroup" element={<AddGroup currentUser={props.currentUser}/>}/>
     <Route path="groupData/:group_name" element={<GroupData currentUser={props.currentUser}/>}/>
     <Route path="addMembers/:group_name" element={<AddMembers currentUser={props.currentUser}/>}/>
     <Route path="editSplit/:id" element={<EditSplit currentUser={props.currentUser}/>}/>
     <Route path="account" element={<Account currentUser={props.currentUser} setAfterLogin ={props.setAfterLogin} init={props.init} setIsRegister={props.setIsRegister} />} />
   </Route>
 </Routes>
</BrowserRouter>


{/* <Link to="/addSplit">
Add Expense
</Link> */}
</div>
);
}

export default App;
