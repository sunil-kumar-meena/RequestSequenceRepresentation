import React, { useState } from 'react';
import './Accordion.css';

function Accordion({ AccordionContent }) {
   const [activeIndex, setActiveIndex] = useState(-1);
   const handleClick = (index) => {
      setActiveIndex(index === activeIndex ? -1 : index);
   };
   return (
      <div>
         {AccordionContent.map((accordion, index) => (
            <div key={accordion.title}>
               <h2 className='form-title' onClick={() => handleClick(index)}>{accordion.title}</h2>
               {index === activeIndex && accordion.content}
            </div>
         ))}
      </div>
   );
}
export default Accordion;