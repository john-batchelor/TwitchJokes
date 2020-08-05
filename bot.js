const tmi = require("tmi.js");
const fetch = require("node-fetch");
require("dotenv/config");

var joke = "";

// Define configuration options
const opts = {
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_PASSWORD
    },
    channels: [
      process.env.TWITCH_CHANNEL
    ]
  };

  // Create a client with our options
  const client = new tmi.client(opts);
  
  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  
  fetchJokes();

  // Connect to Twitch:
  client.connect();
  
  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
  
    // Remove whitespace from chat message
    const commandName = msg.trim();
  
    // If the command is known, let's execute it
    if (commandName === '!joke') {
      const joke = getJoke();
      client.say(target, `${joke}`);
      console.log(`* Executed ${commandName} command`);
    } else {
      console.log(`* Unknown command ${commandName}`);
    }
  }

  function getJoke()
  {
    var thisJoke = joke.joke;
    
    //Get another joke queued.
    fetchJokes();

    return thisJoke;
  }

  function fetchJokes()
  {
    fetch("https://icanhazdadjoke.com/", 
    {
        headers: 
        {
            Accept: "application/json"
        }
    }
    )
    .then(res => res.json())
    .then(json => {
        console.log(json);

        joke = json;
    });

  }

  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }