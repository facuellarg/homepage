import React from 'react';
import './Menu.css'
const Menu =()=>{


    return(
        <ul className={'menu'}>
            <li className={'menu__li'}><a className={'menu__li__a'} href="#integrantes">Integrantes</a></li>
            <li className={'menu__li'}><a className={'menu__li__a'} href="#p1">Analisis de imagen</a></li>
            <li className={'menu__li'}><a className={'menu__li__a'} href="#p2">Proyecto 2</a></li>
            <li className={'menu__li'}><a className={'menu__li__a'} href="#p3">Proyecto 3</a></li>
        </ul>
    )
}

export default Menu