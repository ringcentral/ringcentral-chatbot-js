no_breadcrumb: True

# Creating Your Bot App

Every bot you create must be registered with RingCentral. That can be done manually (see instructions below), or can be created quickly using the button below.

<a href="https://developer.ringcentral.com/new-app?name=My+Bot+App&desc=A+sample+app+created+for+the+javascript+chatbot+framework&public=true&type=ServerBot&permissions=ReadAccounts,EditExtensions,SubscriptionWebhook,TeamMessaging&redirectUri=https://%3Cchatbot-server%3E/bot/oauth" class="btn btn-primary">Create Bot App</a>

## Manual Installation Instructions

1. [Login or create an account](https://developer.ringcentral.com/login.html#/) if you have not done so already.
2. Go to Console/Apps and click 'Create App' button.
3. Give your app a name and description, then click Next.
4. On the second page of the create app wizard enter the following:
    * Select 'Private' for Application Type.
    * Select 'Server-only (No UI)' for Platform Type.
5. On the third page of the create app wizard, select the following permissions:
    * Glip
    * Read Accounts
    * Webhook Subscriptions

