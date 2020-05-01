const http = require('http');
const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser')
const request = require('request');
const puppeteer = require('puppeteer');
const fs = require('fs');

const static_url = process.env.NGROK_URL

const app = express();
app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('public'))


app.post('/', function(req, res) {
  if(req.body.NumMedia !== '0') {
    const selfieFilePath = `public/${req.body.MessageSid}.png`;
    const url = req.body.MediaUrl0;

    request(url).pipe(fs.createWriteStream(selfieFilePath))
      .on('close', () => {
        console.log('Selfie downloaded...')
        fetchWaifu(selfieFilePath, req.body.MessageSid, req.body.From);
    });
  }
});


const fetchWaifu = (selfieFilePath, messageSid, fromNumber) => {
  (async () => {
    console.log('Gathering waifu...')
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://waifu.lofiu.com/index.html');

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      clickByText(page, 'Take A Selfie'),
    ]);
    await fileChooser.accept([selfieFilePath]);

    await page.waitFor(10000); //Give the website time to generate waifu.

    const svgImage = await page.$('#waifu_img');
    const imagePath = `waifu-${messageSid}.png`
    await svgImage.screenshot({
      path: `public/${imagePath}`,
      omitBackground: true,
    });

    console.log('Waifu downloaded...')

    await browser.close();

    sendWaifu(imagePath, fromNumber, process.env.TWILIO_NUMBER)
  })();
}

// source: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
const sendWaifu = (imagePath, to, from) => {
  const client = new twilio();
  client.messages.create({
     body: '',
     from: from,
     mediaUrl: [`${static_url}/${imagePath}`],
     to: to
   })
  .then(message => console.log(`MMS sent: ${message.sid}`));
}

// source: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

// source: https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
  
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};


http.createServer(app).listen(5000, function () {
  console.log("Express server listening on port 5000");
});
