import "./List.css";

import {

FiFolder,

FiClipboard,

FiShield,

FiClock,

FiCheckCircle,

FiSend

} from "react-icons/fi";

import StepCard from "./StepCard";

const List=()=>{

return(

<section className="how">

<h4>

How it works

</h4>

<h1>

Simple. Transparent.<br/>

Secure.

</h1>

<p className="intro">

We make it easy for you to get the right work done with peace of mind.

</p>

<StepCard

number={1}

title="Fund Your Wallet"

description="Add funds to your platform wallet using our secure blockchain payment system."

icon={<FiFolder/>}

/>

<StepCard

number={2}

title="Post a Task"

description="Tell us what you need done. Add details, skills required and your deadline."

icon={<FiClipboard/>}

/>

<StepCard

number={3}

title="We Assign a Verified Student"

description="Our admin reviews your task and assigns the best verified student."

icon={<FiShield/>}

/>

<StepCard

number={4}

title="Work in Progress"

description="Track your task while the student works on it."

icon={<FiClock/>}

/>

<StepCard

number={5}

title="You Review & Approve"

description="Review the completed work. If it meets your expectation, approve it."

icon={<FiCheckCircle/>}

/>

<StepCard

number={6}

title="We Release Payment"

description="Payment is securely released to the student."

icon={<FiSend/>}

/>

</section>

)

}

export default List;