import hotdogs from "./hotdog-menu.js";

let tag = "";

for(let i of hotdogs){
    let hashtag = "";
    for(let h of i.hashtag){
        hashtag += `<span>${h}</span>`;
    }

    let checkNew = '<span class="new">New</span>';
    let checkBest = '<span class="best">Best</span>';
    let new_best = "";
    if(i.new && i.best){
        new_best = `${checkNew}${checkBest}`
    }else if(i.new){
        new_best = `${checkNew}`
    }else if(i.best){
        new_best = `${checkBest}`
    }
    tag += `<div class="box">
                <div class="text">
                    <p class="item-name">${i.name}${new_best}</p>
                    <p class="item-content">${i.content}</p>
                    <p class="item-hashtag">${hashtag}</p>
                </div>
                <div class="item-img">
                    <img src="${i.image}">
                </div>
                <span class="view"><a href="#">VIEW</a></span>
            </div>`;
}

document.querySelector(".wrap").innerHTML = tag;
