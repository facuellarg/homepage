import React from "react";
import Sketch from "react-p5";
import TitilliumWeb from '../../../assets/fonts/TitilliumWeb.ttf'
import AsciiArt from "../../../library/asciiart";
const P5p1 =()=> {

  let myCapture
  function initCaptureDevice(p5) {
    try {
        myCapture = p5.createCapture(p5.VIDEO);
        myCapture.size(initWidth/2,initHeight);
        myCapture.elt.setAttribute('playsinline', '');
        myCapture.hide();
        console.log(
        '[initCaptureDevice] capture ready. Resolution: ' +
        myCapture.width + ' ' + myCapture.height
        );


    } catch(_err) {
        console.log('[initCaptureDevice] capture error: ' + _err);
    }
  }
  const preload=(p5) =>{
     font = p5.loadFont(TitilliumWeb)
  }
  let drawing =()=>{ transformed = origin.get()};
  var myAsciiArt;
  var asciiart_width = 120; var asciiart_height = 60;
  var ascii_arr;

  let initWidth,initHeight,pg1,pg2,origin,transformed,scale=0.4,font,lastKey,img_canvas,ascii_canvas;
  let transformation ="Any";
  let show_image=true;
  const EdgeMask=[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]
  const NormalizedBlurMask =[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]
  const GausianBlurMask =[[1,4,6,4,1],[4,16,24,16,4],[6,24,36,24,6],[4,16,24,16,4],[1,4,6,4,1]]
  const Mask = [[-1, -1, -1, -1, 0],
    [-1, -1, -1, 0, 1],
    [-1, -1, 0, 1, 1],
    [-1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1]]

  const  setup = (p5, canvasParentRef) => {
    initWidth = p5.windowWidth;
    initHeight = p5.windowHeight;
    p5.createCanvas(initWidth,initHeight).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    pg1 = p5.createGraphics(initWidth/2,initHeight)
    pg1.textFont(font,30)
    pg1.textAlign(pg1.CENTER,pg1.TOP)
    initCaptureDevice(p5);
    pg2 = p5.createGraphics(initWidth/2,initHeight)
    img_canvas=p5.createGraphics(initWidth*scale, initWidth*scale)
    ascii_canvas=p5.createGraphics(asciiart_width*1.5,asciiart_height*1.5)
    pg2.textFont(font,30)
    pg2.textAlign(pg2.CENTER,pg2.TOP)
    origin =  p5.createCapture(p5.VIDEO);
    origin.hide()
    transformed =  origin.get()
    myAsciiArt = new AsciiArt(p5);
    p5.frameRate(30);

  };

  const draw = p5 => {


    p5.background('rgba(0,0,0, 0)');
    pg1.image(origin.get(),initWidth*0.05,50,initWidth*scale, initWidth*scale)
    pg1.text('Original Image',initWidth*0.05,10,initWidth*scale, 50);
    pg1.fill(255)
    pg1.stroke(0)
    p5.image(pg1,0,0)
    pg2.text(`Transformed Image: ${transformation}`,initWidth*0.05,10,initWidth*scale, 50)
    ascii_arr=null
    img_canvas.image(transformed.get(),0,0,img_canvas.width,img_canvas.height)
    ascii_canvas.image(origin.get(),0,0,ascii_canvas.width,ascii_canvas.height)
    if(show_image){
      drawing()
      pg2.image(img_canvas,initWidth*0.05,50,initWidth*scale, initWidth*scale)
      pg2.fill(255)
      pg2.stroke(0)
     }else{
      p5.fill(0)
      p5.textAlign(p5.CENTER, p5.CENTER); p5.textFont(font, 8); p5.textStyle(p5.NORMAL);
      p5.rect(initWidth/2+initWidth*0.05,50,initWidth*scale, initWidth*scale);
      p5.fill(255)
      ascii_arr = myAsciiArt.convert(ascii_canvas);
      myAsciiArt.typeArray2d(ascii_arr, p5,initWidth/2+initWidth*0.05,50,initWidth*scale, initWidth*scale);
    }
    p5.image(pg2,initWidth/2,0)



  };

  const to_gray_scale = (r = 0.33,g=0.33,b=0.33) => {
    transformed = origin.get()
     transformed.loadPixels()
     for (var i=0; i < transformed.width*transformed.height*4;i+=4){

       var y = r*(transformed.pixels[i])  +
           g*(transformed.pixels[i+1])+
           b*(transformed.pixels[i+2]);

       transformed.pixels[i] = (y);
       transformed.pixels[i+1] = (y);
       transformed.pixels[i+2] = (y);
     }
     transformed.updatePixels();

  }
  const to_gray_lum=()=>{
    to_gray_scale(0.299,0.587,0.114)
  }
  const to_gray_avg=()=>{
    to_gray_scale()
  }
  const reset_image =()=>{
    transformed = origin.get()
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
        drawing = to_gray_avg
        show_image = true
        setTransform(p5,'GS avarage')

      }else if (p5.key==='l'){
        drawing = to_gray_lum
        show_image = true
        setTransform(p5,'GS lum')

      }else if (p5.key === 'r'){
        drawing = drawing =()=>{ transformed = origin.get()};
        show_image = true
        setTransform(p5,'Any')

      }else if(p5.key === 'e'){
        drawing = ()=>convolution(EdgeMask)
        show_image = true
        setTransform(p5,'Strong Edges')
      }else if(p5.key=== 'n'){
        drawing = ()=>convolution(NormalizedBlurMask)
        show_image = true
        setTransform(p5,'Normalized Blur')
      }else if(p5.key === 'g'){
        show_image = true
        drawing = ()=>convolution(GausianBlurMask)
        setTransform(p5,'Gaussian Blur')
      }else if(p5.key === 'm'){
        show_image = true
        drawing = ()=>convolution(Mask)
        setTransform(p5,'Mask')
      }else if(p5.key==='t'){
        show_image = false
        setTransform(p5,'Ascii')
      }
    }

    lastKey = p5.key

  }

  const setTransform=(p5,s)=>{
    transformation = s
    p5.clear();
    pg2.clear();

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

  return(<Sketch preload={preload} setup={setup} draw={draw} keyPressed={keyPressed}/>)

}
export default P5p1;