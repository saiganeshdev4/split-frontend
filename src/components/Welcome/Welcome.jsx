
import "./Welcome.css";
function Welcome(props)
{
return <div className="welcome-container">
    <p> Welcome {props.currentUser}</p>
</div>
}

export default Welcome;