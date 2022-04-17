const canvas = document.getElementById('responsive-canvas');
const ctx = canvas.getContext('2d');

const downloadButton = document.getElementById('download-image');
let fileLoaded = false;

const fileselected = document.getElementById('file-selected');

function canvasToPNG(){
  const png = canvas.toDataURL('image/png');
  return png;
}

function downloadImage(){
  const anchor = document.createElement('a');
  const png = canvasToPNG();
  anchor.setAttribute('href', png);
  anchor.setAttribute('download', "billete-creativo.png");
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function setValueOnRange(HTMLRangeElement, initialValue){
  HTMLRangeElement.value = initialValue;
  
  const {value, min, max} = HTMLRangeElement;
  
  HTMLRangeElement.style.backgroundSize =  (value - min) * 100 / (max - min) + '% 100%';  
}

downloadButton.addEventListener('click', downloadImage)

const rangeScale = document.getElementById('range-scale');
const xAxis = document.getElementById('x-axis');
const yAxis = document.getElementById('y-axis');

setValueOnRange(rangeScale, 100);
setValueOnRange(xAxis, 0);
setValueOnRange(yAxis, 0);

rangeScale.addEventListener('input',function(){
  const {value, min, max} = this;
  this.style.backgroundSize =  (value - min) * 100 / (max - min) + '% 100%';
  drawCustomBillete(photo);
})

xAxis.addEventListener('input',function(){
  const {value, min, max} = this;
  this.style.backgroundSize =  (value - min) * 100 / (max - min) + '% 100%';
  drawCustomBillete(photo);
})

yAxis.addEventListener('input',function(){
  const {value, min, max} = this;
  this.style.backgroundSize =  (value - min) * 100 / (max - min) + '% 100%';
  drawCustomBillete(photo);
})

const fr = new FileReader();
const inputPhoto = document.getElementById('photo');

const billete = new Image();
billete.src = "/billete.png"

function drawImageOnCanvas(src, initX, initY, width, height){
  ctx.drawImage(src, initX , initY, width, height)
}

function drawBilleteOnCanvas(){
  drawImageOnCanvas(billete, 0, 0, canvas.width, canvas.height);
}


function clearCanvas(){
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawCustomBillete(image){
  const ratio = (image.height/canvas.height);
  let scaleValue = parseInt(rangeScale.value)/100; 
  let xOffset = parseInt(xAxis.value)
  let yOffset = parseInt(yAxis.value)

  const scaledWidth = (image.width * scaleValue)/ratio;
  const scaledHeight = (image.height * scaleValue)/ratio;
  
  const imageXPosition = (canvas.width - scaledWidth)/2 + xOffset;
  const imageYPosition = (canvas.height - scaledHeight)/2 + yOffset;

  clearCanvas();

  drawImageOnCanvas(
    image,
    imageXPosition,
    imageYPosition,
    scaledWidth,
    scaledHeight
  )

  drawBilleteOnCanvas();
}

billete.addEventListener('load', drawBilleteOnCanvas);

let photo = new Image();

inputPhoto.addEventListener('change', (e)=>{
  fr.readAsDataURL(e.currentTarget.files[0]);
  fileselected.innerText = e.currentTarget.files[0].name;
  if(!fileLoaded){
    downloadButton.removeAttribute('disabled');
    fileLoaded = !fileLoaded;
  }
})

fr.addEventListener('load', (e)=>{
  photo.src = e.target.result;
})

photo.addEventListener('load', ({currentTarget})=>{
  drawCustomBillete(currentTarget);
});
