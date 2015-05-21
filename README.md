# Text

Send text messages using the command line. Supports SMS (via Twilio) and WhatsApp.



## Install

```
npm install text-cli
```

## Use

Send an SMS:

```
node text --service twilio --to +12125556666 --message 'hello world'
```

Send a WhatsApp message:

```
node text --service whatsapp --to +12125556666 --message 'hello world'
```

## Setup

This tool requires setup before you can use it. The configuration file is located in `~/.textrc.json` by default and is expected to have a section per service provider. A [skeleton file](dot.textrc.json) is provided and looks like this:

```
{
  "twilio": {
    "number": "NUMBER",
    "accountSID": "ACCOUNT SID",
    "authToken": "AUTH TOKEN"
  },
  "whatsapp": {
    "ccode": "COUNTRY CODE",
    "msisdn": "NUMBER",
    "username": "USERNAME",
    "password": "PASSWORD"
  }
}
```

Read below on setting up for the different providers.

### SMS (Twilio)

You should have a [Twilio](https://twilio.com) account. Once you have your number (say, +12125556666), Account SID, and Auth Token, you should put them in the `twilio` section of the configuration file.

### WhatsApp

You should have a [registered phone number](https://github.com/hidespb/node-whatsapi/wiki/Number-registration). Put your country code, phone number without the leading `+` sign ("msisdn"), username, and password in the `whatsapp` section of the configuration file.

# Contributing

This project follows the ["OPEN Open Source"](https://gist.github.com/substack/e205f5389890a1425233) philosophy. If you submit a pull request and it gets merged you will most likely be given commit access to this repository.

# License

ISC.