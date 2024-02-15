function del(id){
    if(!confirm('정말 삭제하시겠습니까?'))
    fetch('/board/'+id, {method : 'delete'}).then((rs)=>{rs.text()}).then((rs)=>{
        if(rs == 'success'){
            
        }
    })
}