$('#show-hours').on('click', function(){
    let scrollHeight =  $('#hours-detail').prop('scrollHeight') + 'px';

    // $(this).toggleClass('show');
    $(this).text(($(this).text() == 'SHOW HOURS ▼' ? 'HIDE HOURS ▲' : 'SHOW HOURS ▼'));

    if($('#hours-detail').css('max-height') == '0px')
        $('#hours-detail').css('max-height', scrollHeight);
    else
        $('#hours-detail').css('max-height', '0px');
});

$('#hamburger').on('click', function(){
    $('#mobile-gnb-wrapper').css('translate', '0%');
});

function mobile_gnb_close(){
    $('#mobile-gnb-wrapper').css('translate', '-100%');
}

$('#mobile-gnb-close').on('click', mobile_gnb_close);

$(window).resize(function(){
    if($(window).width()+17 > 1024){
        mobile_gnb_close();
    }  
});