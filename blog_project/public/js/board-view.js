function del(id){
    if(!confirm('정말 삭제하시겠습니까?')){
        return;
    }
    fetch('/board/'+id, {method : 'delete'}).then(rs => rs.text())
    .then(text => {
        if(text == 'success'){
            alert('삭제 성공')
            location.href='/board'
        }else{
            alert('삭제 실패')
            return
        }
    })
}