const handleClick = (e) => {
  // WHY DOES THIS LOG THE PARENT TABLE INSTEAD OF THE BUTTON ITSELF????
  console.log(e.target)
  if (e.target.classList.contains("emoji-button")){
    // toggle the clicked class on the button
    console.log(`Button Clicked, state was [${e.target.classList}]"`)
    e.target.classList.toggle('clicked');
  }
};

window.onload=function(){
  document.body.addEventListener("click", handleClick);
}
