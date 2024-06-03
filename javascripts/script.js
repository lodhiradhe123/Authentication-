const img=document.querySelector(".image");
const inp = document.querySelector(".image-input");
const formsbm = document.querySelector(".formsbm")
img.addEventListener("click",function(){
    inp.click();
})
inp.addEventListener("change",()=>{
formsbm.submit();
})