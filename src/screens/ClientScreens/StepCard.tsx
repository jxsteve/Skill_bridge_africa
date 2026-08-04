import "./StepCard.css";

interface Props{

    number:number;

    title:string;

    description:string;

    icon:React.ReactNode;

}

const StepCard=({

number,

title,

description,

icon

}:Props)=>{

return(

<div className="step">

<div className="left-column">

<div className="circle">

{number}

</div>

<div className="line"></div>

</div>

<div className="right-column">

<div className="icon">

{icon}

</div>

<div>

<h3>

{title}

</h3>

<p>

{description}

</p>

</div>

</div>

</div>

)

}

export default StepCard;