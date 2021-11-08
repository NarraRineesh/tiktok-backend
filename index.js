const { default: Axios } = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const qs = require('qs')
var cors = require('cors')
var handlebars = require('handlebars');
var fs = require('fs');
var https = require('https')
var bodyParser = require('body-parser')
const HttpsProxyAgent = require("https-proxy-agent");
const httpsAgent = new HttpsProxyAgent({ host: "45.94.47.108", port: "8152", auth: "hfcewizn:w8hkja84jwem" })


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



app.get("/", (req, res) => {
    app.use(express.static(__dirname));
    const data = require('./en.js')
    readHTMLFile(__dirname + '/index.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = data
        var htmlToSend = template(replacements);
        res.send(htmlToSend);
    })
});
app.get("/en", (req, res) => {

    const data = require('./en.js')
    readHTMLFile(__dirname + '/index.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = data
        var htmlToSend = template(replacements);
        res.send(htmlToSend);
    })
});
app.get("/sp", (req, res) => {
    const data = require('./sp.js')
    readHTMLFile(__dirname + '/index.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = data
        var htmlToSend = template(replacements);
        res.send(htmlToSend);
    })
});
app.get('/get-data/', async (req, res) => {
    try {
        const url = req.query.url
        const data = await tiktokdownload(url);
        console.log(data);
        res.status(200).send(data);

    } catch (error) {
        res.status(404).send(error);
    }
})


app.post("/api/download", async (request, response) => {
    console.log("request coming in...", request.body.url);

    try {
        const links = await instaReel(request.body.url);
        console.log(links);
        if (links.is_video == true) {
            response.json({ downloadLink: links.video_url });
        } else if (links.is_video == false) {
            response.json({ downloadLink: links.display_url });

        } else {
            response.json({ error: "The link you have entered is invalid. " });
        }
    } catch (err) {
        console.log(err);
        response.json({
            error: "There is a problem with the link you have provided."
        });
    }
});

async function instaReel(URL) {
    console.log("called!");
    const { data } = await Axios.get(URL, {
        headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,en-IN;q=0.7",
            "user-agent":
                "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
        },
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        };
    });
    let $ = cheerio.load(data);
    let script = $("script").eq(4).html();
    console.log(JSON.parse(/window\._sharedData = (.+);/g.exec(script)));
    let {
        entry_data: {
            PostPage: {
                [0]: {
                    graphql: {
                        shortcode_media: { display_url, video_url, is_video },
                    },
                },
            },
        },
    } = JSON.parse(/window\._sharedData = (.+);/g.exec(script)[1]);
    return { display_url, video_url, is_video };
}
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;

        }
        else {
            callback(null, html);
        }
    });
};
app.listen(process.env.PORT || 5000, () => {
    console.log(`Application started and Listening on port ${process.env.PORT || 5000}`);
});


function tiktokdownload(url) {
    return new Promise((resolve, reject) => {
        Axios.get('https://ttdownloader.com/')
            .then((data) => {
                const $ = cheerio.load(data.data)
                const cookie = data.headers['set-cookie'].join('')
                const dataPost = {
                    url: url,
                    format: '',
                    token: $('#token').attr('value')
                }
                // return console.log(cookie);
                Axios({
                    method: 'POST',
                    url: 'https://ttdownloader.com/req/',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        origin: 'https://ttdownloader.com',
                        referer: 'https://ttdownloader.com/',
                        cookie: cookie,
                    },
                    data: qs.stringify(dataPost)
                }).then(({ data }) => {
                    const $ = cheerio.load(data)
                    const result = {
                        nowm: $('#results-list > div:nth-child(2) > div.download > a')?.attr('href'),
                        wm: $('#results-list > div:nth-child(3) > div.download > a')?.attr('href'),
                        audio: $('#results-list > div:nth-child(4) > div.download > a').attr('href')
                    }
                    getData(result.wm)
                    resolve(result);
                })
                    .catch(e => {
                        reject({ status: false, message: 'error fetch data', e: e.message })
                    })
            })
            .catch(e => {
                reject({ status: false, message: 'error fetch data', e: e.message })
            })
    })
}

//use axios as you normally would, but specify httpsAgent in the config
function getData(url) {
    Axios.create({ httpsAgent });
    Axios.get(url).then(function (res) {
        // console.log(res.status);
        // console.log(res.headers['x-client-ip']);
        console.log(res.data._currentUrl);
    }).catch(function (err) {
        console.log(err);
    });
}

