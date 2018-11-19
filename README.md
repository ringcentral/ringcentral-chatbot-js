# RingCentral Chatbot Framework for JavaScript

## Demo bots

- [Glip Crontab Chatbot](https://github.com/tylerlong/glip-crontab-chatbot)


## Implemented features

- Bot token management
- Setup bot WebHook
- Remove bot
- Deploy to AWS Lambda
- Update bot name and avatar


## Hidden commands

The following commands are considered "hidden" or "easter eggs":

- `__rename__ <newName>`: rename bot to `newName`
- A single message with text `__setAvatar__` and an attached image file: set bot avatar to the attached image


## Todo

- Handle group removed event
- Create a website to auto generate code for developer to download
    - let developer select what he wants to do, what programming language to use, and finally generate the code for him
- Demo chatbots
    - ping bot
        - reply "pong" when received "ping"
    - RC Assistant
        - Very important bot for user to use RingCentral service
    - survey bot
        - create survey and aggregate result with ease.
    - RingCentral messages monitoring bot
        - monitor RingCentral messages
    - Google drive notification
        - monitor Google Drive folder/file changes


## Notes

- AWS Lambda connects AWS RDS issue
    - If you create an RDS manually and let it create a new security group for you.
        - By default, the security group only allows inbound traffic from your current laptop's public IP address
        - AWS Lambda by default cannot access the newly created AWS RDS
        - We need to update security group to allow inbound traffic from `0.0.0.0/0`
- AWS Lambda and `await` issue
    - AWS Lambda is stateless and it won't keep a background runner
    - So if your code is async, DO remember to `await`. Otherwise that code will not be executed before Lambda invocation terminates
    - I forgot to `await`, a weird phenomenon was: whenver I issued a command, I always got reply of previous command
