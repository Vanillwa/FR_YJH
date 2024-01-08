let menu = document.getElementsByClassName("menu");

for (let i of menu) {
  i.addEventListener("click", function () {
    let panel = this.nextElementSibling;
    var max_Height = panel.style.maxHeight;

    // 클릭한 메뉴 외의 다른 메뉴 모두 닫기
    for(let j of menu){
        if(this != j){
          j.nextElementSibling.style.maxHeight = null;
          j.classList.remove('on');
        }
    }

    this.classList.toggle("on");
    
    if (max_Height) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
