class JSTikTok {
    constructor(url) {
        console.log(url);
        this.url = url;
        this.datas = [];
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
    force_download_video(url, title) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            let binaryData = [];
            binaryData.push(xhr.response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: 'video/mp4' })
            );
            if (title) downloadLink.setAttribute('download', title);
            document.body.appendChild(downloadLink);
            downloadLink.click();

        };
        xhr.send();
    }
    force_download_audio(url, title) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            let binaryData = [];
            binaryData.push(xhr.response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: 'audio/mp3' })
            );
            if (title) downloadLink.setAttribute('download', title);
            document.body.appendChild(downloadLink);
            downloadLink.click();

        };
        xhr.send();
    }



    get = async () => {
        const url = this.urlencode(this.url)
        this.res = await fetch(`https://tt-downloader-knr.herokuapp.com/get-data/?url=${url}`).then(response => response.text()).then((data) => { return data; })

    }

    download_music = async () => {
        const data = JSON.parse(this.res)
        const r = (Math.random() + 1).toString(36).substring(2);
        this.force_download_audio(this.bypassCorsHeaders + this.urlencode(data.audio) + "&d=1", r);
    }
    download_video = async () => {
        const data = JSON.parse(this.res)
        const r = (Math.random() + 1).toString(36).substring(2);
        this.force_download_video(this.bypassCorsHeaders + this.urlencode(data.wm) + "&d=1", r);
    }
    download_video_nowatermark = async () => {
        const data = JSON.parse(this.res)
        const r = (Math.random() + 1).toString(36).substring(2);
        this.force_download_video(this.bypassCorsHeaders + this.urlencode(data.nowm) + "&d=1", r);
    }
}