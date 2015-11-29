$.fn.extend({
			gallerySlide : function() {
				var images = $(this).find("img");
				var slideShow = $(this).next(".slide-show");
				slideShow.append('<span class="bss-prev">«</span><span class="bss-next">»</span>');
				var current = images.first();
				var showImage = $('<img/>').attr('src', current.attr('src')).css('width','500px').css('height','500px');
				slideShow.find('figure').append(showImage);
				$(this).show();
				
				var screenWidth = $(window).width(), screenHeight = $(window).height();  
				var scrolltop = $(document).scrollTop();
				var left = (screenWidth - 500)/2;
				var top = (screenHeight - 500)/2 + scrolltop;
				slideShow.css('top',top).css('left',left);
				
				
				$.fn.gallerySlide.images = images;
				$.fn.gallerySlide.index = 0;
				slideShow.find('.bss-prev').click(function(){
					if($.fn.gallerySlide.index == 0){
						$.fn.gallerySlide.index = $.fn.gallerySlide.images.size()-1;
					}else{
						$.fn.gallerySlide.index = $.fn.gallerySlide.index-1;
					}
					var current = $($.fn.gallerySlide.images.get($.fn.gallerySlide.index));
					
					slideShow.find('img').attr('src', current.attr('src')).css('width','480px').css('height','490px');
				});
				
				slideShow.find('.bss-next').click(function(){
					if($.fn.gallerySlide.index == $.fn.gallerySlide.images.size()-1){
						$.fn.gallerySlide.index = 0;
					}else{
						$.fn.gallerySlide.index = $.fn.gallerySlide.index+1;
					}
					var current = $($.fn.gallerySlide.images.get($.fn.gallerySlide.index));
					
					slideShow.find('img').attr('src', current.attr('src')).css('width','500px').css('height','500px');
				});
			}
		});