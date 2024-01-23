let userInfo = {
    id : 'test',
    pwd : 'test1234!@'
}
console.log('테스트 계정 ▼')
console.log(userInfo);

// input 태그 focus blur 이벤트 설정
$('.input').on('focus', function(){
    $(this).parent().addClass('label-up');
});

$('.input').on('blur', function(){
    if($(this).val() == ''){
        $(this).parent().removeClass('label-up');
    }
});

// submit
function send(f){
    let id = f.id.value;
    let pwd = f.pwd.value;
    var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,12}$/;

    $('.error').removeClass('show');
    
    if(id =='' && pwd == ''){
        $('#both-empty').addClass('show');
        $('#id').focus();
        return;
    }
    if(id == ''){
        $('#id-empty').addClass('show');
        $('#id').focus();
        return;
    }
    if(pwd == ''){
        $('#pwd-empty').addClass('show');
        $('#pwd').focus();
        return;
    }
    if(id.length<4 || id.length>12){
        $('#id-wrong-type').addClass('show');
        $('#id').focus();
        return;
    }
    if(!passwordPattern.test(pwd)){
        $('#pwd-wrong-type').addClass('show');
        $('#pwd').focus();
        return;
    }

    //로그인 검사
    if(id == userInfo.id && pwd == userInfo.pwd){
        alert('로그인 성공');
        location.href='index.html';
    }else if(id == userInfo.id && pwd != userInfo.pwd){
        alert('비밀번호가 일치하지 않습니다.')
        $('#pwd').val('').focus();
        return;
    }else{
        alert('존재하지 않는 계정입니다.');
        $('#login-form')[0].reset();
        $('#id').focus();
        return;
    }
}

// 엔터키로 로그인 실행
$('#login-form').keypress(function(e){
    if(e.keyCode === 13)
        $('#sign-in').click();
})

// 비밀번호 보이기 토글
$('#pwd-toggle').on('click', function(){
    $(this).toggleClass('bi-eye bi-eye-slash');
    
    if($('#pwd').prop('type') == "password"){
        $('#pwd').prop('type', 'text');
    }else{
        $('#pwd').prop('type', 'password');
    }
})

// capslock-alert
$('#pwd').on('keydown keyup', function(e){
  if (e.originalEvent.getModifierState('CapsLock')) {
        $('#capslock-alert').addClass('show')
    }else{
        $('#capslock-alert').removeClass('show')
    }
})

// pwd input에서 blur시 capslock-alert 제거
$('#pwd').on('blur', function(){
    $('#capslock-alert').removeClass('show')
})