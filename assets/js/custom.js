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
    force_download(url,title){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var blob = xhr.response;
            this.datas = blob
            saveAs(blob, title);
                // var url = window.URL.createObjectURL(blob);
                // const a = document.createElement('a');
                // a.style.display = 'none';
                // a.href = url;
                // a.download = fileName;
                // document.body.appendChild(a);
                // a.click();
                // window.URL.revokeObjectURL(url);
            
        };
        xhr.send();		 
    }
    
   

    get = async () => {
    const url = this.urlencode(this.url)
    this.res = await fetch(`https://tt-downloader-knr.herokuapp.com/get-data/?url=${url}`).then(response => response.text()).then((data) => { return data; })
    }
    
    download_music = async () => {
        if(this.datas == null){
            await this.get();
        }
        const data = JSON.parse(this.res)
        const r = (Math.random() + 1).toString(36).substring(2);
        // this.force_download(this.bypassCorsHeaders + this.urlencode(data.wm) + "&d=1",r+'.mp3');
        var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(blob, "hello world.txt");
        // saveAs(,r+'.mp3');
    }
    download_video = async () => {
        // if(this.datas == null){
        //     await this.get();
        // }
        // const data = JSON.parse(this.res)
        // const r = (Math.random() + 1).toString(36).substring(2);
        // this.force_download(this.bypassCorsHeaders + this.urlencode(data.wm) + "&d=1",r+'.mp4');
        await fetch(`https://tt-downloader-knr.herokuapp.com/get-video/`,).then(response => response.text()).then((data) => { return data; })
    }
    download_video_nowatermark = async () =>{
        if(this.datas == null){
            await this.get();
        }
        const data = JSON.parse(this.res)
        const r = (Math.random() + 1).toString(36).substring(2);
        this.force_download(this.bypassCorsHeaders + this.urlencode(data.nowm) + "&d=1",r+'.mp4');
          } 
}