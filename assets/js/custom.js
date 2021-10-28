(function ($) {
	
	"use strict";

	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	



	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 130
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Home seperator
	if($('.home-seperator').length) {
		$('.home-seperator .left-item, .home-seperator .right-item').imgfix();
	}


	// Home number counterup
	if($('.count-item').length){
		$('.count-item strong').counterUp({
			delay: 10,
			time: 1000
		});
	}


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 992) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}


})(window.jQuery);

class JSTikTok {
    constructor(url) {
        console.log(url);
      this.url = url;
      this.datas = null;
      this.res = null
    }
    bypassCorsHeaders = "https://cors-tiktok.herokuapp.com/?u="; //Bypass CORS (Github : https://github.com/abdelyouni/cors-tiktok)

    urlencode(str) {
        str = (str + '').toString();
        return encodeURIComponent(str)
            .replace('!', '%21')
            .replace('\'', '%27')
            .replace('(', '%28')
            .replace(')', '%29')
            .replace('*', '%2A')
            .replace('%20', '+');
    }
    force_download(url,title,format){
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var blob = xhr.response;
            const fileName = title+'.'+format;
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else { // for others
                var url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            };
        };
        xhr.send();		 
    }

    get = async () => {
    const url = this.urlencode(this.url)
    await fetch(`https://tt-downloader-knr.herokuapp.com/get-data/?url=${url}`).then(response => response.text()).then((data) => {
        console.log(data);
        this.datas = data
         return data; 
        })
  
     
        // var patterns = ['<link data-react-helmet="true" rel="canonical" href="','"/>','>','</','id="__NEXT_DATA__"']
        // var tiktokUrl = this.bypassCorsHeaders + this.urlencode(this.url);
        // var resp =  await fetch(tiktokUrl).then(response => response.text()).then((data) => { return data; });
        // // console.log(resp);
        // if (resp.includes(patterns[0])) {
        //     tiktokUrl = resp.split(patterns[0])[1].split(patterns[1])[0];
        //     resp =  await fetch(this.bypassCorsHeaders + this.urlencode(tiktokUrl)).then(response => response.text()).then((data) => { return data; });
        // }
        
        // var json = JSON.parse(resp.split(patterns[4])[1].split(patterns[3])[0].split(patterns[2])[1]);
        // console.log(json.props.pageProps.itemInfo.itemStruct.video);

        // var video = {
        //     id:json.props.pageProps.itemInfo.itemStruct.video.id,
        //     height:json.props.pageProps.itemInfo.itemStruct.video.height,
        //     duration:json.props.pageProps.itemInfo.itemStruct.video.duration,
        //     sizeFormat:json.props.pageProps.itemInfo.itemStruct.video.ratio,
        //     cover:json.props.pageProps.itemInfo.itemStruct.video.cover,
        //     animatedCover:json.props.pageProps.itemInfo.itemStruct.video.dynamicCover,
        //     likes:json.props.pageProps.itemInfo.itemStruct.stats.diggCount,
        //     shares:json.props.pageProps.itemInfo.itemStruct.stats.shareCount,
        //     comments:json.props.pageProps.itemInfo.itemStruct.stats.commentCount,
        //     vues:json.props.pageProps.itemInfo.itemStruct.stats.playCount,
        //     title:json.props.pageProps.itemInfo.itemStruct.author.nickname,
        //     download_url:json.props.pageProps.itemInfo.itemStruct.video.playAddr,
        // };

        // var music = {
        //     id:json.props.pageProps.itemInfo.itemStruct.music.id,
        //     title:json.props.pageProps.itemInfo.itemStruct.music.title,
        //     cover_large:json.props.pageProps.itemInfo.itemStruct.music.coverLarge,
        //     cover_medium:json.props.pageProps.itemInfo.itemStruct.music.coverMedium,
        //     cover_small:json.props.pageProps.itemInfo.itemStruct.music.coverThumb,
        //     artist:json.props.pageProps.itemInfo.itemStruct.music.authorName,
        //     album:json.props.pageProps.itemInfo.itemStruct.music.album,
        //     duration:json.props.pageProps.itemInfo.itemStruct.music.duration,
        //     url:json.props.pageProps.itemInfo.itemStruct.music.playUrl,
        // };

        // var author = {
        //     id:json.props.pageProps.itemInfo.itemStruct.author.id,
        //     uniqueId:json.props.pageProps.itemInfo.itemStruct.author.uniqueId,
        //     username:json.props.pageProps.itemInfo.itemStruct.author.nickname,
        //     avatar_large:json.props.pageProps.itemInfo.itemStruct.author.avatarLarger,
        //     avatar_medium:json.props.pageProps.itemInfo.itemStruct.author.avatarMedium,
        //     avatar_small:json.props.pageProps.itemInfo.itemStruct.author.avatarThumb,
        //     signature:json.props.pageProps.itemInfo.itemStruct.author.signature,
        //     createDate:json.props.pageProps.itemInfo.itemStruct.author.createTime,
        //     isVerified:json.props.pageProps.itemInfo.itemStruct.author.verified,
        //     followers:json.props.pageProps.itemInfo.itemStruct.authorStats.followerCount,
        //     followings:json.props.pageProps.itemInfo.itemStruct.authorStats.followingCount,
        //     hearts:json.props.pageProps.itemInfo.itemStruct.authorStats.heart,
        //     totalVideos:json.props.pageProps.itemInfo.itemStruct.authorStats.videoCount,
        //     diggCount:json.props.pageProps.itemInfo.itemStruct.authorStats.diggCount,
        // };
       
    }
    
    download_music = async () => {
        if(this.datas == null){
            await this.get();
        }
        this.force_download(this.bypassCorsHeaders + this.urlencode(this.datas.wm) + "&d=1",'music','mp3');
    }
    download_video = async () => {
        if(this.datas == null){
            await this.get();
        }
        this.force_download(this.bypassCorsHeaders + this.urlencode(this.datas.wm) + "&d=1",'video','mp4');
    }
    download_video_nowatermark = async () =>{
        
       
        this.force_download(this.bypassCorsHeaders + this.urlencode(this.data.nowm) + "&d=1",'nowm_video','mp4');
          } 
}