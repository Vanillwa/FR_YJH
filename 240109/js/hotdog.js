import hotdogs from "./hotdog-menu.js";

let tag = "";

for(let i of hotdogs){
    let hashtag = "";
    for(let h of i.hashtag){
        hashtag += `<span>${h}</span>`;
    }

    let checkNew = (i.new) ? " new" : '';
    let checkBest = (i.best) ? " best" : '';

    tag += `<div class="box">
                <div class="text">
                    <p class="item-name${checkNew}${checkBest}">${i.name}</p>
                    <p class="item-content">${i.content}</p>
                    <p class="item-hashtag">${hashtag}</p>
                </div>
                <div class="item-img">
                    <img src="${i.image}">
                </div>
            </div>`;
}

document.querySelector(".wrap").innerHTML = tag;
