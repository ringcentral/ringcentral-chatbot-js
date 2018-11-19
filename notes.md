## Bot joins a new group

```json
{
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

## Create a new Glip team

```js
{
  "uuid": "2326438199677577290",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-19T05:37:30.221Z",
  "subscriptionId": "9db80cd9-f1d4-4103-bb8d-62cdc7974af3",
  "ownerId": "2025981020",
  "body": {
    "id": "18591629318",
    "name": "Crontab Test team",
    "description": null,
    "type": "Team",
    "status": "Active",
    "members": [
      "850957020",
      "2025981020"
    ],
    "isPublic": false,
    "creationTime": "2018-11-19T05:37:30.083Z",
    "lastModifiedTime": "2018-11-19T05:37:30.083Z",
    "eventType": "GroupJoined"
  }
}
```


## Delete Glip team

```js
{
  "uuid": "4985801586516742717",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-19T05:39:45.060Z",
  "subscriptionId": "9db80cd9-f1d4-4103-bb8d-62cdc7974af3",
  "ownerId": "2025981020",
  "body": {
    "id": "18591629318",
    "name": "Crontab Test team-deactivated1542605984980",
    "description": null,
    "type": "Team",
    "status": "Active",
    "members": [
      "3195740163",
      "105407881219"
    ],
    "isPublic": false,
    "creationTime": "2018-11-19T05:37:30.083Z",
    "lastModifiedTime": "2018-11-19T05:39:45.032Z",
    "eventType": "GroupLeft"
  }
}
```


## Remove some one else from Glip team

```js
{
  "uuid": "5358907638239853509",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-19T05:47:24.371Z",
  "subscriptionId": "9db80cd9-f1d4-4103-bb8d-62cdc7974af3",
  "ownerId": "2025981020",
  "body": {
    "id": "18591678470",
    "name": "Crontab test team",
    "description": null,
    "type": "Team",
    "status": "Active",
    "members": [
      "850957020",
      "2025981020"
    ],
    "isPublic": false,
    "creationTime": "2018-11-19T05:43:50.793Z",
    "lastModifiedTime": "2018-11-19T05:47:24.345Z",
    "eventType": "GroupChanged"
  }
}
```


## Remove bot from Glip team

```js
{
  "uuid": "2551463240961383186",
  "event": "/restapi/v1.0/glip/posts",
  "timestamp": "2018-11-19T05:49:28.557Z",
  "subscriptionId": "9db80cd9-f1d4-4103-bb8d-62cdc7974af3",
  "ownerId": "2025981020",
  "body": {
    "id": "18591678470",
    "name": "Crontab test team",
    "description": null,
    "type": "Team",
    "status": "Active",
    "members": [
      "850957020"
    ],
    "isPublic": false,
    "creationTime": "2018-11-19T05:43:50.793Z",
    "lastModifiedTime": "2018-11-19T05:49:28.529Z",
    "eventType": "GroupLeft"
  }
}
```


## Receive new message

```json
{
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


## Receive message with mention

```json
{
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
