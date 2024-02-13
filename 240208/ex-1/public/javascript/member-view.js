function del(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    fetch('/member/'+id, {method : 'delete'})
    .then(()=>{
        location.href='/member';
    })
}

function modify(id){
    location.href="/member/"+id+"/update";
}