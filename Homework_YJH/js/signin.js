let userInfo = {
    id : 'test',
    pwd : 'test1234!@'
}

$('.input').on('focus', function(){
    $(this).parent().addClass('label-up');
});

$('.input').on('blur', function(){
    if($(this).val() == ''){
        $(this).parent().removeClass('label-up');
    }
});

function send(f){
    let id = f.id.value;
    let pwd = f.pwd.value;
    var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,12}$/;

    if(id =='' && pwd == ''){
        alert('아이디와 비밀번호를 입력해주세요.');
        $('#id').focus();
        return;
    }
    if(id == ''){
        alert('아이디를 입력해주세요.');
        $('#id').focus();
        return;
    }
    if(pwd == ''){
        alert('비밀번호를 입력해주세요.');
        $('#pwd').focus();
        return;
    }
    if(id.length<4 || id.length>12){
        alert('아이디는 4~12글자 입니다.')
        $('#id').focus();
        return;
    }
    if(!passwordPattern.test(pwd)){
        alert('올바르지 않은 비밀번호 형식입니다.');
        $('#pwd').focus();
        return;
    }

    //로그인 검사
    if(id== userInfo.id && pwd == userInfo.pwd){
        alert('로그인 성공!');
        return;
    }else{
        alert('로그인 실패!');
        return;
    }
}