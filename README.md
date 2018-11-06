## RingCentral Chatbot Framework for JavaScript

## Thoughts

### From Tyler Liu:

There are existing frameworks such as Hubot, BotBuilder, Errbot...etc which provide high level abstractions among different chatting services: Glip, slack, Microsoft team...etc.

None of them could handle complex bots very well.  In a complex bot, there are complex relationships between Bot user, Glip group and RC user.

Let’s say we want the bot to monitor voicemail for us. We can setup the monitoring in any Glip Group, for any RC user. Then there are often many-to-many mappings among Bot user, Glip group and RC user.

The other tricky part is lifetime management:  Bot user token and RC user token have separate lifetime. Tokens expire. And they could be removed/deactivated/revoked, Glip groups can be removed too…, and user can leave a Glip group…etc

I feel it is necessary to build a Chatbot framework, for Glip, to enable developers to build complex bots like rc-assistant, rc-ai-bot (https://github.com/ringcentral-tutorials/ringcentral-ai-bot) with ease.


### From John Wang:

Here are some thoughts. Part of this includes having a separate OAuth token store service for use with other apps. It could in theory, support Bot tokens, Bot User tokens, CTI user tokens, Archiver user tokens, etc.

Ease of use wrt RingCentral/Glip bot: We want to make it to the user doesn't have to think about the RingCentral / Glip aspects of the API. They should just be able to put in some environment variables and a basic hello world requirement should work without code, other than to load a hello world intent. We may want to this to support other chat platforms too since we currently maintain bots for Slack and Google Hangouts via Vasily's Python Bot Framework.

Managing User OAuth Tokens: Linking to a user service like RingCentral should ideally be decoupled from the underlying bot mechanics. It should be able to be used by multiple bot skills by different authors. Ideally the OAuth token manager service could be used by apps like Archiver, Google extension, Embeddable, etc. Ideally this same service would work with multiple OAuth providers like Google, Salesforce, etc.

Intents interface and routing: The bot should have the concept of intents and should be able to have a mapping of utterance phrases to intents. There could be a simple regexp mapper and then you could build in using a more complicated NLP system like AWS Lex or Google Dialogflow. This allows easy to understanding of building compartmentalized code.

HTTP Engine interface: Ideally the bot could minimally run locally using localhost and on AWS Lambda and have a "HTTP Engine Interface". Other options include Google Cloud Functions, Azure Functions, etc., but minimally localhost and AWS Lambda.

We also want to have bot frameworks in a few popular languages and have them behave in a similar way, like our SDKs. JavaScript and Python among the most popular languages overall and good for us to start since we have bot efforts in both.


### From Embbnux Ji:

I think we can just create a OAuth plugin for Bot Framework . Such as BotBuilder supports to add plugin for it.  Now I can add Luis or Dialogflow AI easily, because Botbuilder support to add AI plugin.
