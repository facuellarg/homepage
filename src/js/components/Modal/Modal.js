import React from 'react';
import './Modal.css'
const Modal = (props)=>{

    const {child, showModal} = props;
    return(
       <div className="modal"style={{display:showModal ? 'flex' : 'none' }}>
           {child}
       </div>
    );
}

export default Modal