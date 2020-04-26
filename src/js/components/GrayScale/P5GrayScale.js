import React from "react";
import Sketch from "react-p5";
import fire from '../../.././assets/images/fire.jpg'

// import font from '.././assets/fonts/AppleBraille-Outline8Dot-100.vlw'
const P5GrayScale =()=> {
  const EdgeMask=[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]
  const NormalizedBlurMask =[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]
  const GausianBlurMask =[[1,4,6,4,1],[4,16,24,16,4],[6,24,36,24,6],[4,16,24,16,4],[1,4,6,4,1]]
  const Mask = [[-1, -1, -1, -1, 0],
    [-1, -1, -1, 0, 1],
    [-1, -1, 0, 1, 1],
    [-1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1]]
  var origin,transformed,initWidth,initHeight;
  var lastKey = null
  var scale = 0.4
  var transformation = 'Any'
  // let myFont;
  // const preload=(p5) =>{
  //   myFont = p5.loadFont(font)
  // }

  const  setup = (p5, canvasParentRef) => {
    initWidth = p5.windowWidth;
    initHeight = p5.windowHeight;
    p5.createCanvas(initWidth,initHeight).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)


    p5.textSize(30)

    origin = p5.loadImage(fire)
    transformed = p5.loadImage(fire)
    p5.textAlign(p5.CENTER, p5.TOP);

  };

  const draw = p5 => {

    p5.background('rgba(0,0,0, 0)');
    p5.text('Original Image',initWidth*0.05,10,initWidth*scale, 50);
    p5.fill(255,255,255)
    p5.stroke(0)

    p5.image(origin,initWidth*0.05,50,initWidth*scale, initWidth*scale)
    p5.text(`Transformed Image: ${transformation}`,initWidth/2,10,initWidth*scale,50);
    p5.image(transformed,initWidth/2,50,initWidth*scale, initWidth*scale)



  };

  const to_gray_scale = (r = 0.33,g=0.33,b=0.33) => {
    origin.loadPixels();
    transformed.loadPixels()
    for (var i=0; i < origin.width*origin.height*4;i+=4){

      var y = r*(origin.pixels[i])  +
          g*(origin.pixels[i+1])+
          b*(origin.pixels[i+2]);

      transformed.pixels[i] = (y);
      transformed.pixels[i+1] = (y);
      transformed.pixels[i+2] = (y);
    }
    transformed.updatePixels();
  }

  const reset_image =()=>{
    origin.loadPixels()
    transformed.loadPixels()
    for (var i=0; i < origin.width*origin.height*4;i+=4){
      transformed.pixels[i] = origin.pixels[i];
      transformed.pixels[i+1] = origin.pixels[i+1];
      transformed.pixels[i+2] = origin.pixels[i+2];
    }
    transformed.updatePixels()
  }

  const keyPressed = p5 =>{
    if (lastKey ==='1'){
      if (p5.key==='a'){
        to_gray_scale()
        setTransform(p5,'GS avarage')

      }else if (p5.key==='l'){
        to_gray_scale(0.299,0.587,0.114)
        setTransform(p5,'GS lum')

      }else if (p5.key === 'r'){
        reset_image()
        setTransform(p5,'Any')

      }else if(p5.key === 'e'){
        convolution(EdgeMask)
        setTransform(p5,'Strong Edges')
      }else if(p5.key=== 'n'){
        convolution(NormalizedBlurMask)
        setTransform(p5,'Normalized Blur')
      }else if(p5.key === 'g'){
        convolution(GausianBlurMask)
        setTransform(p5,'Gaussian Blur')
      }else if(p5.key === 'm'){
        convolution(Mask)
        setTransform(p5,'Mask')
      }
    }
    lastKey = p5.key

  }
  const setTransform=(p5,s)=>{
    transformation = s
    p5.clear();

  }

  const convolution =(mask)=>{

    origin.loadPixels();
    transformed.loadPixels()
    let column,row;
    let radius = Math.floor(mask.length/2)

    for (let k = 0; k < origin.width*origin.height;k++){
      let index = k*4
      row = Math.floor(k/origin.width)
      column = k%origin.width
      let nR=0,nB=0,nG=0,accum=0;
      for (let i = 0; i< mask.length; i++){
        for (let j = 0; j< mask.length; j++){
          let indexX = (column - radius + j +origin.width)%origin.width
          let indexY = (row - radius + i+origin.height)%origin.height
          nR += origin.pixels[(indexY*origin.width+indexX)*4] * mask[i][j]
          nG += origin.pixels[(indexY*origin.width+indexX)*4+1] * mask[i][j]
          nB += origin.pixels[(indexY*origin.width+indexX)*4+2] * mask[i][j]
          accum += mask[i][j]
        }
      }
      if( accum > 1){
        nR = nR/accum
        nG = nG/accum
        nB = nB/accum
      }
      transformed.pixels[index]= Math.round(nR)
      transformed.pixels[index+1]= Math.round(nG)
      transformed.pixels[index+2]= Math.round(nB)
    }
    transformed.updatePixels()


  }

  return(<Sketch setup={setup} draw={draw} keyPressed={keyPressed}/>)

}
export default P5GrayScale;