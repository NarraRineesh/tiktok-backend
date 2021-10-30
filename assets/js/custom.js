class JSTikTok {
    constructor(url) {
        console.log(url);
      this.url = url;
      this.datas = null;
      this.res = null
    }
    bypassCorsHeaders = "https://cors-tiktok.herokuapp.com/?u=";

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
    downloadURI(uri, name) 
{
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

    get = async () => {
    const url = this.urlencode(this.url)
    this.res = await fetch(`http://localhost:5000/get-data/?url=${url}`).then(response => response.text()).then((data) => { return data; })
     console.log(JSON.parse(this.res));
        // var patterns = ['<link data-react-helmet="true" rel="canonical" href="','"/>','>','</','id="__NEXT_DATA__"']
        // var tiktokUrl = this.bypassCorsHeaders + this.urlencode(this.url);
        // var resp =  await fetch(tiktokUrl).then(response => response.text()).then((data) => { return data; });
        // // console.log(resp);
        // if (resp.includes(patterns[0])) {
        //     tiktokUrl = resp.split(patterns[0])[1].split(patterns[1])[0];
        //     resp =  await fetch(this.bypassCorsHeaders + this.urlencode(tiktokUrl)).then(response => response.text()).then((data) => { return data; });
        // }
        
        // var json = JSON.parse(resp.split(patterns[4])[1].split(patterns[3])[0].split(patterns[2])[1]);

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
        // this.datas = {video:video,music:music,author:author}
    }
    
    download_music = async () => {
        if(this.datas == null){
            await this.get();
        }
        const data = JSON.parse(this.res)
        this.force_download(this.bypassCorsHeaders + this.urlencode(data.wm) + "&d=1",'mucic','mp3');
    }
    download_video = async () => {
        if(this.datas == null){
            await this.get();
        }
        const data = JSON.parse(this.res)
        this.force_download(this.bypassCorsHeaders + this.urlencode(data.wm) + "&d=1",'with watermark','mp4');
    }
    download_video_nowatermark = async () =>{
        
        const data = JSON.parse(this.res)
        this.downloadURI(data.nowm,'without water mark');
          } 
}