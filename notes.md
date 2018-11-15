## Bot joins a new group

```json
Message received via bot WebHook: {
  "uuid": "5158275104974072285",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-15T07:10:33.501Z",
  "subscriptionId": "52de10f4-1995-4912-b81c-77f9145ea8f4",
  "ownerId": "2014173020",
  "body": {
    "id": "222468202498",
    "name": null,
    "description": null,
    "type": "PrivateChat",
    "status": "Active",
    "members": [
      "850957020",
      "2014173020"
    ],
    "isPublic": null,
    "creationTime": "2018-11-15T07:10:33.442Z",
    "lastModifiedTime": "2018-11-15T07:10:33.442Z",
    "eventType": "GroupJoined"
  }
}
```


## bot receives new message

```json
Message received via bot WebHook: {
  "uuid": "1751899930604923873",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-15T07:11:39.355Z",
  "subscriptionId": "52de10f4-1995-4912-b81c-77f9145ea8f4",
  "ownerId": "2014173020",
  "body": {
    "id": "6526854774788",
    "groupId": "222468202498",
    "type": "TextMessage",
    "text": "ping",
    "creatorId": "850957020",
    "addedPersonIds": null,
    "creationTime": "2018-11-15T07:11:39.317Z",
    "lastModifiedTime": "2018-11-15T07:11:39.317Z",
    "attachments": null,
    "activity": null,
    "title": null,
    "iconUri": null,
    "iconEmoji": null,
    "mentions": null,
    "eventType": "PostAdded"
  }
}
```


## Bot receives message with mention

```json
Message received via bot WebHook: {
  "uuid": "801051588120689156",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-15T07:13:50.127Z",
  "subscriptionId": "52de10f4-1995-4912-b81c-77f9145ea8f4",
  "ownerId": "2014173020",
  "body": {
    "id": "6526863548420",
    "groupId": "222468202498",
    "type": "TextMessage",
    "text": "![:Person](2014173020)  test",
    "creatorId": "850957020",
    "addedPersonIds": null,
    "creationTime": "2018-11-15T07:13:49.957Z",
    "lastModifiedTime": "2018-11-15T07:13:49.957Z",
    "attachments": null,
    "activity": null,
    "title": null,
    "iconUri": null,
    "iconEmoji": null,
    "mentions": [
      {
        "id": "2014173020",
        "type": "Person",
        "name": "2018-11-15-15-08"
      }
    ],
    "eventType": "PostAdded"
  }
}
```


## Private chat group

```json
{
  "id": "222468202498",
  "name": null,
  "description": null,
  "type": "PrivateChat",
  "status": "Active",
  "members": [
    "850957020",
    "2014173020"
  ],
  "isPublic": null,
  "creationTime": "2018-11-15T07:10:33.442Z",
  "lastModifiedTime": "2018-11-15T07:31:01.447Z"
}
```
