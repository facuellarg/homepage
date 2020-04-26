import React from "react";
import './DetailProfile.css'


const DetailProfile = (props) =>{
    const{name, description, interests}=props;
    const listInterest = (interests.map( (interest,key) =>
        <li className="table-detail__l-item"key={key}>{interest}</li>
    ))

    return(
        <table className="table-detail">
            <tbody>
            <tr className="table-detail__row">
                <td>Nombre:</td>
                <td>{name}</td>
            </tr>
            <tr className="table-detail__row">
                <td>Quien soy:</td>
                <td>{description}</td>
            </tr>
            <tr className="table-detail__row">
                <td>Intereses</td>
                <td>
                    <ul>
                        {listInterest}
                    </ul>
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export default DetailProfile
