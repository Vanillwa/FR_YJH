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
        new_best = `<div class="new-best">${checkNew}${checkBest}</div>`
    }else if(i.new){
        new_best = `<div class="new-best">${checkNew}</div>`
    }else if(i.best){
        new_best = `<div class="new-best">${checkBest}</div>`
    }

    tag += `<div class="box">
                <div class="item-img">
                    <img src="${i.image}" alt="${i.name}">
                </div>
                <div class="item-info">
                    <div>
                        <div class="item-name">${i.name}</div>
                        ${new_best}
                        <p class="item-content">${i.content}</p>
                    </div>
                    <p class="item-hashtag">${hashtag}</p>
                </div>
            </div>`;
}

document.querySelector(".wrap").innerHTML = tag;
