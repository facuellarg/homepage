import React, {useState} from 'react';
import Modal from "../Modal/Modal";
import './CardMedia.css';
import DetailProfile from "../DetailProfile/DetailProfile";


const CardMedia = (props) =>{
    const{name,description,image, interests} = props;
    const [showModal, setModal] = useState(false);
    const openModal =()=> {
        setModal(!showModal);
    }


    return(

        <div className={"card-media"} onClick={openModal}>
            <div className="card-media__image-container">
                <img src={image} 
                alt={`imagen del estudiante ${name}`}
                className="card-media__image"
                />
            </div>
            <div className="card-media__text">
                <div className="card-media__name">
                    <p>
                        {name}
                    </p>
                </div>
                <div className="card-media__description">
                       <p>{description}</p>
                </div>
            </div>
            <Modal child={<DetailProfile
                name={name}
                description={description}
                interests ={interests}
            />} showModal={showModal}></Modal>
        </div>
    )
}
export default CardMedia;