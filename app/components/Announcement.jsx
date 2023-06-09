import { useState } from "react";

export default function Annoucement({announcement}) {
    const [hovered, setHovered] = useState(false);
    return (
      <div  className={"h-auto donfred-annoucement lg:h-10 cursor-pointer px-10 py-2 text-center lg:flex w-full items-center justify-center bg-corange text-white"} onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
        <p className="text-sm  "> {announcement} </p><span   className={`ml-2 inline-block transform-gpu transition-transform duration-300 ${
                      hovered? 'scale-x-150' : 'scale-x-100'
                    }`}>
                    →
                  </span>
      </div>
    ) 
  }
  