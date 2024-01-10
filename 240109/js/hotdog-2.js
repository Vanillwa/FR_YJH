import hotdogs from "./hotdog-menu.js";

let tag = "";

for(let i of hotdogs){
    let hashtag = "";
    for(let h of i.hashtag){
        hashtag += `<span>${h}</span>`;
    }

    let checkNew = (i.new) ? '<span class="new">New</span>' : '';
    let checkBest = (i.best) ? '<span class="best">Best</span>' : '';

    tag += `<div class="box">
                <div class="text">
                    <div class="item-name">${i.name}${checkNew}${checkBest}</div>
                    <p class="item-content">${i.content}</p>
                    <p class="item-hashtag">${hashtag}</p>
                </div>
                <div class="item-img">
                    <img src="${i.image}">
                </div>
            </div>`;
}

document.querySelector(".wrap").innerHTML = tag;
