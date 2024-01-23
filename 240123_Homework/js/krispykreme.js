//location section의 show hours 아코디언 메뉴
$('#show-hours').on('click', function(){
    let scrollHeight =  $('#hours-detail').prop('scrollHeight') + 'px';

    // $(this).toggleClass('show');
    $(this).text(($(this).text() == 'SHOW HOURS ▼' ? 'HIDE HOURS ▲' : 'SHOW HOURS ▼'));

    if($('#hours-detail').css('max-height') == '0px')
        $('#hours-detail').css('max-height', scrollHeight);
    else
        $('#hours-detail').css('max-height', '0px');
});

//햄버거바로 mobile-gnb 열기
$('#hamburger').on('click', function(){
    $('#mobile-gnb-wrapper').css('translate', '0%');
});

//mobile-gnb 닫는 function
function mobile_gnb_close(){
    $('#mobile-gnb-wrapper').css('translate', '-100%');
}

//mobile-gnb의 x버튼으로 gnb 닫기
$('#mobile-gnb-close').on('click', mobile_gnb_close);

//화면 width가 1024보다 늘어나면 mobile-gnb 닫기
$(window).resize(function(){
    if($(window).width()+17 > 1024){
        mobile_gnb_close();
    }
});

//footer-mobile 아코디언 메뉴
$('.footer-nav-mobile .nav-box .footer-title').on('click', function(){
    let wrapper = $(this).siblings('.items-wrapper');
    let scrollHeight = wrapper.prop('scrollHeight') + 'px';
    if(wrapper.css('max-height') == '0px')
        wrapper.css('max-height', scrollHeight);
    else
        wrapper.css('max-height', '0px');

    $(this).parent().toggleClass('show');
})

//swiper 설정
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    slidesPerView : '4',
    autoHeight : false,
    spaceBetween: 0,
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },

    breakpoints: { 
        0:{slidesPerView:1},
        641:{slidesPerView:2},
        1025:{slidesPerView: 4}
    },
});

//mobile-gnb 이외의 구역 클릭시 gnb 닫기
$('html').click(function(e) {   
	if($(e.target).hasClass('bi-list') || $(e.target).hasClass('mobile-gnb-wrapper') || $(e.target).parents('.mobile-gnb-wrapper').length > 0){   
		return;
	}
    mobile_gnb_close();
});