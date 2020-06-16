import React from "react";
import Sketch from "react-p5";
import fire from '../../.././assets/images/fire.jpg'
import TitilliumWeb from '../../../assets/fonts/TitilliumWeb.ttf'
const P5p1 =()=> {

  const preload=(p5) =>{
     font = p5.loadFont(TitilliumWeb)
     origin = p5.loadImage(fire);
     transformed = p5.loadImage(fire);
  }
  let cols = 500;
  let scale=0.4
  let tiles = 5
  const max_bound = 20;
  let image_ascii;
  let width_tile,height_tile;
  let to_ascii=false
  const ascii_array = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~i!lI;:,\"^`. "
  let histogram=new Array(255)
  let histMax;
  let initWidth,initHeight,pg1,pg2,origin,transformed,font,lastKey;
  let transformation ="Any";
  const EdgeMask=[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]
  const NormalizedBlurMask =[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]
  const GausianBlurMask =[[1,4,6,4,1],[4,16,24,16,4],[6,24,36,24,6],[4,16,24,16,4],[1,4,6,4,1]]
  const Laplacian = [[ -1, -1, -1, -1, -1, ],  
  [ -1, -1, -1, -1, -1, ],  
  [ -1, -1, 24, -1, -1, ],  
  [ -1, -1, -1, -1, -1, ],  
  [ -1, -1, -1, -1, -1  ]]
  let show_histogram = false;

  const  setup = (p5, canvasParentRef) => {
    initWidth = p5.windowWidth;
    initHeight = p5.windowHeight;
    p5.createCanvas(initWidth,initHeight).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    origin = p5.loadImage(fire)
    transformed = p5.loadImage(fire)
    pg1 = p5.createGraphics(initWidth/2,initHeight)
    pg1.textFont(font,30)
    pg1.textAlign(pg1.CENTER,pg1.TOP)
    // slider = p5.createSlider(1, max_bound, 6);
    // slider.hide()
    pg2 = p5.createGraphics(initWidth/2,initHeight)
    image_ascii=p5.createGraphics(initWidth/2,initHeight)
    image_ascii.fill(0)
    image_ascii.textSize(tiles)
    image_ascii.textStyle(pg2.NORMAL)
    image_ascii.textAlign(pg2.CENTER)
    cols =origin.width/tiles
    pg2.textFont(font,30)
    pg2.textAlign(pg2.CENTER,pg2.TOP)
    p5.frameRate(30);
    calc_histogram(p5,transformed)
    
  };
  const init_image_ascii = p5=>{
    image_ascii=p5.createGraphics(initWidth/2,initHeight)
    image_ascii.fill(0)
    image_ascii.background(255)
    image_ascii.textSize(Math.sqrt(width_tile*height_tile))
    image_ascii.textStyle(pg2.NORMAL)
    image_ascii.textAlign(pg2.CENTER)
  }

  const draw = p5 => {

    p5.background('rgba(0,0,0, 0)');
    pg1.image(origin,initWidth*0.05,50,initWidth*scale, initWidth*scale)
    pg1.text('Original Image',initWidth*0.05,10,initWidth*scale, 50);
    pg1.fill(255)
    pg1.stroke(0)
    p5.image(pg1,0,0)
    
    
    if(to_ascii){
      // pg2.background(255)
      pg2.image(image_ascii,initWidth*0.05,50,initWidth*scale,initWidth*scale)
     }else{
      pg2.image(transformed,initWidth*0.05,50,initWidth*scale, initWidth*scale)
      
      // pg2.colorMode(p5.HSB)
      }
      if(show_histogram){
        pg2.stroke(255)
        for (let i = 0; i < histogram.length; i ++) {
          // pg2.stroke(i, 100, 100, 1);
          let hist_heigh = parseInt(p5.map(histogram[i],0,histMax,50 + initWidth*scale,50))
          // Map i (from 0..img.width) to a location in the histogram (0..255)
          let x = parseInt(p5.map(i, 0, 254, initWidth*0.05, initWidth*0.05+initWidth*scale));
          // Convert the histogram value to a location between 
          // the bottom and the top of the picture
          // let y = parseInt(p5.map(histogram[which], 0, histMax, transformed.height, 0));
          pg2.line(x, 50 + initWidth*scale, x, hist_heigh);
          
      }
      pg2.noStroke()
      
    }
  
    pg2.text(`Transformed Image: ${transformation}`,initWidth*0.05,10,initWidth*scale, 50)
    p5.image(pg2,initWidth/2,0)
    



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
        to_ascii = false
        setTransform(p5,'GS avarage')
        calc_histogram(p5,transformed)
      }else if (p5.key==='l'){
        to_gray_scale(0.299,0.587,0.114)
        to_ascii = false
        setTransform(p5,'GS lum')
        calc_histogram(p5,transformed)

      }else if (p5.key === 'r'){
        reset_image()
        to_ascii = false
        setTransform(p5,'Any')
        calc_histogram(p5,transformed)
      }else if(p5.key === 'e'){
        convolution(EdgeMask)
        to_ascii = false
        setTransform(p5,'Strong Edges')
        calc_histogram(p5,transformed)
      }else if(p5.key=== 'n'){
        convolution(NormalizedBlurMask)
        to_ascii = false
        setTransform(p5,'Normalized Blur')
        calc_histogram(p5,transformed)
      }else if(p5.key === 'g'){
        to_ascii = false
        convolution(GausianBlurMask)
        setTransform(p5,'Gaussian Blur')
        calc_histogram(p5,transformed)
      }else if(p5.key === 'm'){
        to_ascii = false
        convolution(Laplacian)
        setTransform(p5,'Laplacian')
        calc_histogram(p5,transformed)
      }else if(p5.key==='t'){
        image_to_ascii(p5)
        setTransform(p5,'Ascii Tile size: '+tiles)
        
      }else if(p5.keyCode === p5.UP_ARROW){
        tiles +=1 
        tiles = Math.min(tiles, max_bound)
        image_to_ascii(p5)
        setTransform(p5,'Ascii Tile size: '+tiles)
      }else if(p5.keyCode === p5.DOWN_ARROW){
        tiles -=1 
        tiles = Math.max(tiles, 1)
        image_to_ascii(p5)
        setTransform(p5,'Ascii Tile size: '+tiles)
      }else if(p5.key === 'h'){
        show_histogram = !show_histogram
      }
      
    }
    

    lastKey = p5.key

  }
  const image_to_ascii = p5 =>{
    cols = origin.width/tiles
    to_gray_scale(0.2126,0.7152,0.0722)
    let aspect_ratio=transformed.width/transformed.height
    width_tile = Math.round(transformed.width/cols)
    height_tile = Math.round(width_tile/aspect_ratio)  
    init_image_ascii(p5)
    transformed.loadPixels()
    for (let i = 0; i < transformed.height; i+=height_tile) {
    for (let j = 0; j < transformed.width; j+=width_tile){
      let k=0,l=0
      let brightness_avarage = 0;
      for ( k=0; k<height_tile;k++){   
        for( l=0;l<width_tile;l++){
          let current_index=((k+i)*transformed.width+(l+j))*4
          brightness_avarage += transformed.pixels[current_index]
        }
      }
      brightness_avarage = brightness_avarage/(k*l)
      image_ascii.text(ascii_array[parseInt((brightness_avarage*(ascii_array.length-1))/255)],j*(image_ascii.width/transformed.width),i*((image_ascii.height/transformed.height)))
    }
  }
    to_ascii=true

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

  const calc_histogram =(p5,img)=>{
    for (let i = 0; i < histogram.length;i++){
      histogram[i]=0;
    }
      // Calculate the histogram
      img.loadPixels()
      for (let i=0;i<img.width*img.height*4;i+=4){
        let bright = parseInt(0.299*img.pixels[i]+
          0.587*img.pixels[i+1]+
          0.114*img.pixels[i+2]);
        histogram[bright]++;
      }
      histMax = p5.max(histogram);
  }

  const get_t = (p5,img,x,y)=>{
    let index = (y*img.width+x)*4
    img.loadPixels()
    return p5.color(img.pixels[index],img.pixels[index+1],img.pixels[index+2])
  }
  return(<Sketch preload={preload} setup={setup} draw={draw} keyPressed={keyPressed}/>)

}
export default P5p1;