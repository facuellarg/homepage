import React, { useState} from "react";
import P5p1 from './P5p1'
import P5p1v  from'./P5p1v'
const Project1 =()=>{

    const[image,setImage] = useState(true)
    const[buttonText,setButtonText] = useState('Video')

    const onClickImage=()=>{
        setImage(!image)
        if(!image){
            setButtonText('Video')
        }else{
            setButtonText('Image')
        }
    }
    return(<div>
        <p>En este proyecto se quiere ver las diferentes transformaciones que se le pueden dar a una imagen y la informacion que podemos obtener de las mismas</p>
        <button  onClick={onClickImage}>{buttonText} </button>
        {image?
            <P5p1></P5p1>:
            <P5p1v></P5p1v>
        }
    </div>)

}

export default Project1