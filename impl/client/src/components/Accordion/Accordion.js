import React, { useState } from 'react';
import './Accordion.css';

/**
 * below funtion handles acordion tab's open and close functionality
 */
const accordionTab = (element) => {
         element.target.nextElementSibling.classList.toggle("inactive");
         element.target.classList.toggle("open");
         var accordionPanel = element.target.nextElementSibling;
         if (accordionPanel.style.maxHeight) {
            accordionPanel.style.maxHeight = null;
         } else {
            accordionPanel.style.maxHeight = accordionPanel.scrollHeight + "px";
         }
};

/**
 * Accordion component to create accordion's heading and body
 */
function Accordion({ AccordionContent }) {
   return (
      <div>
         {AccordionContent.map((accordion) => (
            <div key={accordion.title}>
               <h2 className='form-title accordion close' onClick={accordionTab} >{accordion.title}</h2>
               <div class="panel">
                  { (accordion.content) }
               </div>
            </div>
         ))}
      </div>
   );
}
export default Accordion;