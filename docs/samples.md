no_breadcrumb: True

# Built using the RingCentral Chatbot Framework...

The following bots serve as simple examples for the kinds of bots that can be built using this framework. Each is open source and can serve as a reference implementation on how to build and deploys bots with different capabilities. 

## Message Scheduler

The [Glip Crontab Chatbot](https://www.ringcentral.com/apps/glip-crontab-chatbot) allows Glip users to schedule future Glip notifications.

Developers can view the [source code on Github](https://github.com/tylerlong/glip-crontab-chatbot) to learn how to handle messages from users and how to reply.

## RingCentral Assistant

The [RingCentral Chatbot Assistant](https://www.ringcentral.com/apps/glip-rc-assistant-chatbot) allows Glip users to query/edit their RingCentral data and account via Glip.

Developers can view the [source code on Github](https://github.com/tylerlong/rc-assistant) to learn how to:

* Connect to and authorize users (via OAuth) on a third-party service.
* Respond to commands.
* Create a built-in help and support system. 

## Google Drive Notifications

The [Google Drive Chatbot](https://www.ringcentral.com/apps/glip-google-drive-chatbot) allows Glip users to monitor their Google Drive account for changes. When documents change, notifications are sent to Glip which the bot displays to users.

Developers can view the [source code on Github](https://github.com/tylerlong/glip-google-drive-chatbot) to learn how to:

* Connect to and authorize users (via OAuth) on a third-party service.
* Receive callbacks from a third-party service to generate notifications in Glip.
* Format notifications to include richly formated content. 