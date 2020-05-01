# waifu-mms-bot

Generate your waifu using Twilio MMS. Simply send a selfie to your Twilio number via MMS and receive your waifu in return.

This project was built on April 30, 2020 for the [Twilio Hackathon on DEV](https://dev.to/devteam/announcing-the-twilio-hackathon-on-dev-2lh8).

This is a project was built using [Express](https://expressjs.com/), [Twilio](https://www.twilio.com/), [Puppeteer](https://github.com/puppeteer/puppeteer), and most importantly [Selfie 2 Waifu](https://waifu.lofiu.com/index.html). 

## Development

To run this locally app locally you'll need to do the following (replacing the values as you go):

```
git clone https://github.com/Brodan/waifu-mms-bot.git
npm install
export TWILIO_ACCOUNT_SID='XXXXXXXXXXXXXXXXXXXXXXX'
export TWILIO_AUTH_TOKEN='YYYYYYYYYYYYYYYYYY'
export TWILIO_NUMBER='+15555555555'

# run this in a in a seperate terminal
# install instructions: https://ngrok.com/download
ngrok http  5000

# copy your ngrok URL and export it
# also make sure configure your Twilio number to point to *YOUR_NGROK_URL*
export NGROK_URL=*YOUR_NGROK_URL*

npm start

```

Once everything is configured and running, send a selfie via MMS to the Twilio number you configured and wait a few seconds to get your response.

All images will be saved to the `/public` directory.

## Contributors

- [brodan](https://github.com/brodan) - creator, maintainer

## Acknowledgements

Special thanks to the following people:

- [creke](creke.net) for building the entirety of the pSelfie 2 Waifu](https://waifu.lofiu.com/index.html) app. Read more about it [here](https://waifu.lofiu.com/about.html).
- [tokland](https://gist.github.com/tokland) for providing some Puppeteer utilities in [this](https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52) gist which I used in this project.

## License

MIT
