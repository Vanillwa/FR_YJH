let book = function(id, title, author, price, eventItem){
    this.id = id
    this.title = title
    this.author = author
    this.price = price
    this.eventItem = eventItem
    this.showInfo = function(){
        console.log(this)
    }
}

let book1 = new book(1,'용의자 x의 헌신', '히가시노 게이고', 15900, true)

//let {id, title, author, price, eventItem} = book1

// document.getElementById('call-btn').addEventListener('click', () => {
//     console.log(`id : ${id}\ntitle : ${title}\nauthor : ${author}\nprice : ${price}\nevent : ${eventItem}`)
// });

document.getElementById('call-btn').addEventListener('click', () => {
    let {id, title, author, price, eventItem} = book1
    let discount = eventItem ? '10% 할인 진행중' : '';
    let content = 
    `
    <li><span>아이디 : </span><span>${id}</span></li>
    <li><span>제목 : </span><span>${title}</span></li>
    <li><span>작가 : </span><span>${author}</span></li>
    <li><span>가격 : </span><span>${price}</span></li>
    <li><span>이벤트 : </span><span>${discount}</span></li>
    `
    document.getElementById('bookInfo').innerHTML = content;
});