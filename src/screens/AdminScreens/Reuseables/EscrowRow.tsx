import "./EscrowRow.css";

interface EscrowRowProps{
title:string;
amount:string;
status:string;
}

const EscrowRow=({
title,
amount,
status
}:EscrowRowProps)=>{

const badge=
status==="Funded"
?"funded"
:status==="Released"
?"released"
:"disputed";

return(

<div className="escrow-row">

<div>

<h4>{title}</h4>

<p>{amount}</p>

</div>

<span className={`badge ${badge}`}>

{status}

</span>

</div>

);

};

export default EscrowRow;