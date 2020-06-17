import React from 'react';
import CardMedia from "./components/CardMedia/CardMedia";
import avatar from "../assets/images/avatar1.png"
import Menu from "./components/Menu/Menu"
import Project1 from "./components/Project1/Project1";

import './../css/app.css'

const App = () =>{
    const course = "Comptuacion Visual"
  return (
     <div className="main-container">
        <Menu></Menu>
         <div className="main-container__welcome-text">
         <p align="center">Estudiantes Que presentan el taller  1 del curso {course}</p>
        </div>

         <a href="#profiles" name="integrantes"></a>
             <div className="profiles">
                 <CardMedia
                     name={'Freddy'}
                     description={'Estudiante de ingenieria de sistemas cursando 9 semestre'}
                     image={avatar}
                     interests={["correr","dormir","jugar lolcito"]}
                 />
                 <CardMedia
                     name={'Alejandro'}
                     description={'Estudiante de ingenieria de sistemas cursando 9 semestre Estudiante de ingenieria de sistemas cursando 9 semestre Estudiante de ingenieria de sistemas cursando 9 semestre ' }
                     image={avatar}
                     interests={["nadar","jmmmm","jugar brawlcito"]}
                 />
             </div>


         <a href="#p1" name="p1"></a>
            <div className="main-container__p1">
                <Project1></Project1>
            </div>

     </div>
  );
}

export default App;
