import "./PendingVerifications.css";

import EscrowRow from "./EscrowRow";

const EscrowActivity=()=>{

return(

<section className="table-card">

<div className="table-header">

<h3>Recent Escrow Activity</h3>

</div>

<EscrowRow

title="Logo Design • Chidi O."

amount="₦45,000 in escrow"

status="Funded"

/>

<EscrowRow

title="Website Copy • Ngozi E."

amount="₦30,000 in escrow"
status="Released"

/>

<EscrowRow

title="Brand Kit • Fatima B."

amount="₦80,000 in escrow"

status="Disputed"

/>

</section>

);

};

export default EscrowActivity;