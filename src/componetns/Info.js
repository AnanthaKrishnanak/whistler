import React from "react";
import Card from "./Card";
export default function () {
  const data = [
    {
      title: "Anonymity",
      description:
        "Anonymity is about hiding the “who”, while privacy is about hiding the “what”.Anonymity means the ability for parties to exchange data without disclosing any off-chain identity information or other transactions they have done.Example is Bitcoin, which is partially anonymous, but not private at all.",
    },
    {
      title: "Immutability",
      description:
        "Immutability can be defined as the ability of a blockchain ledger to remain unchanged, for a blockchain to remain unaltered and indelible. More succinctly, data in the blockchain cannot be altered. Each block of information, such as facts or transaction details, proceed using a cryptographic principle or a hash value.",
    },
    {
      title: "Transparency",
      description:
        "Bitcoin works with an unprecedented level of transparency that most people are not used to dealing with. All Bitcoin transactions are public, traceable, and permanently stored in the Bitcoin network.Anyone can see the balance and all transactions of any address.Users must be careful not to disclose their addresses.",
    },
  ];
  return (
    <div className="info" style={{marginLeft:"300px"}}>
      <div className="info--title"><h1>What Whistler offers</h1></div>
      <div className="dynamic">
        {data.map(function (obj) {
          return <Card title={obj.title} description={obj.description}  />;
        })}
      </div>
    </div>
  );
}
