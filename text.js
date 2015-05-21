var fs = require('fs'),
    commander = require('commander'),
    _ = require('underscore'),
    twilio = require('twilio'),
    whatsapi = require('whatsapi');

var config;

function config_save() {
  fs.writeFileSync(commander.config, JSON.stringify(config, null, 2));
}

function twilio_handler() {
  twilio = twilio(config.twilio.accountSID, config.twilio.authToken);
  twilio.messages.create({
    to: commander.to,
    from: config.twilio.number,
    body: commander.message
  });
}

function whatsapp_handler() {
  var client = whatsapi.createAdapter(config.whatsapp);
  client.connect(function (err) {
    if (err) {
      return;
    }

    client.login(function (err) {
      if (err) {
        return err;
      }

      var phone = commander.to.slice(1);
      if (!config.whatsapp.contacts) {
        config.whatsapp.contacts = [];
      }
      if (!_.contains(config.whatsapp.contacts, phone)) {
        config.whatsapp.contacts.push(phone);
        config_save();
      }

      client.requestContactsSync(config.whatsapp.contacts, 'full', 'interactive', function (err, result) {
        client.sendIsOnline();

        client.sendMessage(phone, commander.message, function (err, id) {
          client.sendIsOffline();
          client.disconnect();
        });
      });
    });
  });
}

var handlers = {
  twilio: twilio_handler,
  whatsapp: whatsapp_handler
};

function main() {
  commander
    .version('0.0.1')
    .option('-c, --config [file]', 'Configuration file [$HOME/.textrc.json]', process.env.HOME + '/.textrc.json')
    .option('-s, --service [name]', 'Service name (supported: ' + _.keys(handlers).join(', ') + ')')
    .option('-m, --message [message]', 'Message text')
    .option('-t, --to [destination]', 'To destination (phone number, etc.)')
    .parse(process.argv);

  try {
    config = JSON.parse(fs.readFileSync(commander.config));
    if (!config) {
      throw config;
    }
  } catch (ex) {
    console.log('could not read configuration file', commander.config);
    return;
  }

  if (!commander.service) {
    commander.outputHelp();
    return;
  }
  var handler = handlers[commander.service];
  if (!handler) {
    console.log('unrecognized service:', commander.service);
    return;
  }

  return handler();
}

main();