/* Description: Custom JS file */


(function($) {
    "use strict"; 
	
    /* Navbar Scripts */
    // jQuery to collapse the navbar on scroll
    $(window).on('scroll load', function() {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
    });
    
	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
    });

    // offcanvas script from Bootstrap + added element to close menu on click in small viewport
    $('[data-toggle="offcanvas"], .navbar-nav li a:not(.dropdown-toggle').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })

    // hover in desktop mode
    function toggleDropdown (e) {
        const _d = $(e.target).closest('.dropdown'),
            _m = $('.dropdown-menu', _d);
        setTimeout(function(){
            const shouldOpen = e.type !== 'click' && _d.is(':hover');
            _m.toggleClass('show', shouldOpen);
            _d.toggleClass('show', shouldOpen);
            $('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
        }, e.type === 'mouseleave' ? 300 : 0);
    }
    $('body')
    .on('mouseenter mouseleave','.dropdown',toggleDropdown)
    .on('click', '.dropdown-menu a', toggleDropdown);


    /* Move Form Fields Label When User Types */
    // for input and textarea fields
    $("input, textarea").keyup(function(){
		if ($(this).val() != '') {
			$(this).addClass('notEmpty');
		} else {
			$(this).removeClass('notEmpty');
		}
	});
	

    /* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function() {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function() {
		$(this).blur();
	});

    /* Contact form AJAX submit - only enable when running a local dev server (localhost)
        The site also uses a FormSubmit AJAX POST in the inline script for production hosting.
        This prevents double form submission messages when the site is served from non-localhost.
    */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        $('#contactForm').on('submit', function(e){
            e.preventDefault();
            var $form = $(this);
            var $btn = $form.find('button[type="submit"]');
            // remove old messages
            $form.find('.form-message').remove();
            var data = {
                name: $('#cname').val(),
                email: $('#cemail').val(),
                message: $('#cmessage').val()
            };

            $btn.prop('disabled', true).text('Sending...');

            $.ajax({
                url: 'http://localhost:3000/api/contact',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(res){
                    console.log('Contact form success response:', res);
                    var msg = $('<p class="form-message text-success mt-3">Message sent. Thank you!</p>');
                    $form.append(msg);
                    $form[0].reset();
                    $('input,textarea').removeClass('notEmpty');
                    msg.delay(5000).fadeOut(function(){ $(this).remove(); });
                },
                error: function(xhr){
                    console.error('Contact form error response:', xhr && xhr.responseJSON ? xhr.responseJSON : xhr);
                    var text = 'Error sending message. Please try again later.';
                    if (xhr && xhr.responseJSON && xhr.responseJSON.error) text = xhr.responseJSON.error;
                    var msg = $('<p class="form-message text-danger mt-3"></p>').text(text);
                    $form.append(msg);
                    msg.delay(7000).fadeOut(function(){ $(this).remove(); });
                },
                complete: function(){
                    $btn.prop('disabled', false).text('Submit');
                }
            });
        });
    }

})(jQuery);