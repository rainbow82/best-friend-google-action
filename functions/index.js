'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow, Permission, Suggestions,} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Permission({
        context: 'Hi there, to get to know you better',
        permissions: 'NAME'
    }));
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if (!permissionGranted) {
        conv.ask(`Ok, no worries. How can I help you today?`);
        // conv.ask(new Suggestions('Blue', 'Red', 'Green'));
    } else {
        conv.data.userName = conv.user.name.given;
        conv.ask(`Thanks, ${conv.data.userName}. What's going on today?`);
        // conv.ask(new Suggestions('Blue', 'Red', 'Green'));
    }
});


// Handle the Dialogflow intent named 'bad day'.
// The intent collects a parameter named 'day'.
app.intent('bad day', (conv, {dayType}) => {
    const dayDescription = dayType;
    // Respond with empathy and a compliment to brighten the users day
    if (conv.data.userName) {
    conv.close(`I am sorry you had a ${dayDescription} day, ${conv.data.userName}.` + randomResponseForBadDay);
    }
});

app.intent('presentation', (conv, {presentation}) => {
    //const presentationDescription= presentation;
    conv.close(randomResponseForProject);
});

app.intent('compliment', (conv, {feeling}) => {
    // Respond with empathy and a compliment to brighten the users day
    conv.close(randomResponseForCompliment);
});

const responsesForBadDay = [
    'You are awesome.',
    'You rock!',
    'Mirror Mirror on the wall, you are the fairest of them all.',
    'You make my day better.',
    'You are so fetch.',
    'The world would be darker without you.',
    'You are the most perfect you there is.',
    'You\'re stronger than you know.',
    'Here\'s a virtual hug.',
]

const responsesForProject = [
    'You will knock their socks off.',
    'You will shine like a star',
    'You could survive a Zombie apocalypse. You\'ve got this.',
    'Your presentation is on point. Don\'t worry about it.',
]

const responsesForCompliment = [
    'You look great today!',
    'You have cute elbows. For reals!',
    'Is that your picture next to charming in the dictionary?',
    'If you were a box of crayons, you\'d be the giant name-brand one with the built-in sharpener',
    'If you were a scented candle they\'d call it Perfectly Imperfect (and it would smell like summer).',
    'You\'re better than a triple-scoop ice cream cone. With sprinkles.',
    'You\'re all that and a bag of chips.',
    'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.'

]

var badDayResponseIndex = Math.floor(Math.random() * responsesForBadDay.length);
var randomResponseForBadDay = responsesForBadDay[badDayResponseIndex];

var projectResponseIndex = Math.floor(Math.random() * responsesForProject.length);
var randomResponseForProject = responsesForProject[projectResponseIndex];

var complimentResponseIndex = Math.floor(Math.random() * responsesForCompliment.length);
var randomResponseForCompliment = responsesForCompliment[complimentResponseIndex];

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
