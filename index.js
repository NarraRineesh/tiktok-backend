const { default: Axios } = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const qs = require('qs')
const FormData = require('form-data')
var cors = require('cors')
var bodyParser = require('body-parser')


const app = express()
app.use(cors())
app.use(bodyParser.json())
// server css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/get-data/', async (req, res) => {
     try {
     const url = req.query.url
        const data = await  tiktokdownload(url);
        console.log(data);
        res.status(200).send(data);
          
     } catch (error) {
          res.status(404).send(error);
     }       
 })
 app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
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

