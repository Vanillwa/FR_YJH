const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,12}$/;
const nicknameRegex = /^(?=.*[a-z가-힣])[a-z가-힣0-9]{2,10}$/;
let emailCheck = false;
let emailVerify = false;
let nicknameCheck = false;

// input 태그 focus blur 이벤트 설정
$(".input").on("focus", function () {
    $(this).parent().addClass("label-up");
});

$(".input").on("blur", function () {
    if ($(this).val() == "") {
        $(this).parent().removeClass("label-up");
    }
});

// 엔터키로 로그인 실행
$("#login-form").keypress(function (e) {
    if (e.keyCode === 13) $("#sign-up").click();
});

// Email 유효성 검사
$("#email").on("input", function () {
    $(".email-alert").removeClass("show");
    $(".verify").attr("disabled", true);
    $("#verifyNum").val("");
    $("#verifyNum").parent().removeClass("label-up");
    $(".verify-alert").removeClass("show");
    emailVerify = false;
    emailCheck = false;
    let email = $("#email").val();
    let data = { email };
    if (email != "") {
        if (emailRegex.test(email)) {
            $("#email-wrongtype").removeClass("show");
            fetch("/emailCheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((rs) => rs.text())
                .then((text) => {
                    if (text == "available") {
                        emailCheck = true;
                        $("#email-available").addClass("show");
                        $(".verify").attr("disabled", false);
                    } else {
                        $("#email-used").addClass("show");
                    }
                });
        } else {
            $("#email-wrongtype").addClass("show");
        }
    }
});

// 이메일 인증번호 발송
function sendVerify() {
    let email = $("#email").val();
    let data = { email };

    if (emailCheck) {
        fetch("/emailVerify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((rs) => rs.json())
            .then((rs) => {
                if (rs.message == "success") {
                    alert("인증번호를 발송하였습니다.");
                } else {
                    alert("인증번호 발송을 실패했습니다.");
                }
            });
    }
}

// 인증번호 유효성 검사
$("#verifyNum").on("input", function () {
    $(".verify-alert").removeClass("show");
    emailVerify = false;
    let number = $("#verifyNum").val();
    let data = { number };
    if (number != "") {
        if (number.length == 6) {
            fetch("/verifyNumCheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((rs) => rs.text())
                .then((text) => {
                    if (text == "success") {
                        emailVerify = true;
                        $("#verify-success").addClass("show");
                    } else {
                        $("#verify-fail").addClass("show");
                    }
                });
        } else {
            $("#verify-wrongtype").addClass("show");
        }
    }
});

// 닉네임 유효성 검사
$("#nickname").on("input", function () {
    $(".nickname-alert").removeClass("show");
    nicknameCheck = false;
    let nickname = $("#nickname").val();
    let data = { nickname };
    if (nickname != "") {
        if (nicknameRegex.test(nickname)) {
            $("#nickname-wrongtype").removeClass("show");
            fetch("/nicknameCheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((rs) => rs.text())
                .then((text) => {
                    if (text == "available") {
                        nicknameCheck = true;
                        $("#nickname-available").addClass("show");
                    } else {
                        $("#nickname-used").addClass("show");
                    }
                });
        } else {
            $("#nickname-wrongtype").addClass("show");
        }
    }
});

// 비밀번호 유효성 검사
$("#pwd").on("input", function () {
    $(".pwd-alert").removeClass("show");
    pwdCheck = false;
    let pwd = $("#pwd").val();
    if (pwd != "") {
        if (passwordRegex.test(pwd)) {
            pwdCheck = true;
            $("#pwd-success").addClass("show");
        }else{
            $("#pwd-fail").addClass("show");
        }
    }
});

// 비밀번호 보이기 토글
$("#pwd-toggle").on("click", function () {
    $(this).toggleClass("bi-eye bi-eye-slash");

    if ($("#pwd").prop("type") == "password") {
        $("#pwd").prop("type", "text");
    } else {
        $("#pwd").prop("type", "password");
    }
});

// capslock-alert
$("#pwd").on("keydown keyup", function (e) {
    if (e.originalEvent.getModifierState("CapsLock")) {
        $("#capslock-alert").addClass("show");
    } else {
        $("#capslock-alert").removeClass("show");
    }
});

// pwd input에서 blur시 capslock-alert 제거
$("#pwd").on("blur", function () {
    $("#capslock-alert").removeClass("show");
});

// submit
function send(f) {
    let email = f.email.value;
    let pwd = f.pwd.value;
    let nickname = f.nickname.value;

    $(".error").removeClass("show");

    if (!emailCheck) {
        alert('올바르지 않은 이메일입니다.')
        $("#email").focus();
        return;
    }
    if (!emailVerify) {
        alert('이메일이 인증되지 않았습니다.')
        $("#verifyNum").focus();
        return;
    }
    if (!nicknameCheck) {
        alert('올바르지 않은 닉네임입니다.')
        $("#nickname").focus();
        return;
    }
    if (!pwdCheck) {
        alert('올바르지 않은 비밀번호입니다.')
        $("#pwd").focus();
        return;
    }

    f.submit();
}
