$.fn.extend({
			gallerySlide : function(options) {
				var thisObj = this;
				var images = $(thisObj).find("img");
				var slideShow = $("#slide-show");
				var current = images.first();
				
				var showImage = $('<img/>').attr('src', current.attr('src'));
				slideShow.find('figure').append(showImage);
				
				var screenWidth = $(window).width(), screenHeight = $(window).height();  
				var scrolltop = $(document).scrollTop();
				var left = (screenWidth - 500)/2;
				var top = (screenHeight - 500)/2 + scrolltop;
				slideShow.css('top',top).css('left',left);
				
				
				slideShow.find('.bss-prev').click(function(){
					var activeLiElement = thisObj.find('li.active');
					activeLiElement.removeClass('active');
					var newActiveLiElement = activeLiElement.prev();
					
					var noMoreElement = newActiveLiElement.size()==0;
					if(noMoreElement){
						newActiveLiElement = thisObj.find('li').last();
					}
					newActiveLiElement.addClass('active');
					slideShow.find('img').attr('src', newActiveLiElement.find('img').attr('src'));
				});
				
				slideShow.find('.bss-next').click(function(){
					var activeLiElement = thisObj.find('li.active');
					activeLiElement.removeClass('active');
					var newActiveLiElement = activeLiElement.next();
					
					var noMoreElement = newActiveLiElement.size()==0;
					if(noMoreElement){
						newActiveLiElement = thisObj.find('li').first();
					}
					newActiveLiElement.addClass('active');
					slideShow.find('img').attr('src', newActiveLiElement.find('img').attr('src'));
				});
				
				slideShow.find('.bss-close').click(function(){
					slideShow.hide();
				});
			},
			
			play : function(liElement) {
				var thisObj = $(this);
				if(!liElement){
					liElement = thisObj.find('li').first();
				}
				thisObj.find('li.active').each(function(i,e){
					$(e).removeClass('active');	
				});
				
				liElement.addClass('active');

				var allImages = $(thisObj).find("img");
				var slideShow = $("#slide-show");
				slideShow.find('img').attr('src', liElement.find('img').attr('src'));
			
				slideShow.show();
			}
			
		});