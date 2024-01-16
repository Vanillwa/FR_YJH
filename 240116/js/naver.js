let userInfo = {id : 'korea', pwd : 'korea11!'}

let id_pwd_inputs = document.querySelectorAll('.id-pw-input');
let login_error_wraps = document.querySelectorAll('.login-error-wrap');

for(let i of id_pwd_inputs){
    i.addEventListener('focus', function(){
        this.parentElement.classList.add('check');
    })
    i.addEventListener('blur', function(){
        this.parentElement.classList.remove('check');
    })
}

function send(f){
    let id = f.id.value;
    let pwd = f.pwd.value;
    var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,12}$/;

    for(let i of login_error_wraps){
        i.classList.remove('show');
    }

    //유효성 검사
    if(id =='' && pwd == ''){
        login_error_wraps[0].classList.add('show');
        return;
    }
    if(id == ''){
        login_error_wraps[1].classList.add('show');
        return;
    }
    if(pwd == ''){
        login_error_wraps[2].classList.add('show');
        return;
    }
    if(id.length<4 || id.length>12){
        alert('아이디는 4~12글자 입니다.')
        return;
    }
    if(!passwordPattern.test(pwd)){
        alert('올바르지 않은 비밀번호 형식입니다.');
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