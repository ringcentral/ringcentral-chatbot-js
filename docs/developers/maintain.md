no_breadcrumb: True

# Maintaining & Supporting Bots

The Bot Framework exposes via an admin interface a number of functions to help bot developers and operators support and maintain their bot. 

## Bot Maintenance

This function is useful in the following cases:

* Reset Webhooks Subscriptions - Webhook subscriptions expire automatically on RingCentral. RingCentral may also blacklist your Webhook handler if it responds with too many errors. This method will resubscribe your app to webhook notifications relevant to your bot. 
* Clean-up Databases - This will clean up any orphaned data in your datase.

Invoke this function as follows:

```bash
curl -X PUT -u admin:password https://<bot-server>/admin/maintain
```

!!! note "Recommendation"
    It is recommended that you create a cron job to run this command daily.

## Bot Diagnostics

If your bot begins to behave strangely, or becomes unresponsive, invoke this command to get some insight into what is happening in the framework.

```
curl -X GET -u admin:password https://<bot-server>/admin/diagnostic
```

## Hidden commands

The framework automattically adds support for the following commands to perform special actions that make maintaining your bot easier:

- `__rename__ <newName>`: rename bot to `newName`
- `__setAvatar__` with an attached image file: set bot avatar to the attached image
