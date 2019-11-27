# LiveChat chat-sdk
​
Lightweight JavaScript SDK for LiveChat Messaging APIs.
​
Chat SDK was designed to help developers build apps in a quick and easy way. Under the hood, it makes use of the LiveChat Messaging APIs, taking care of this part for you. By default, Chat SDK comes with a method for sending plain text messages. Based on the method template we provide, you can easily build other methods. Thanks to that, you have the flexibility to cover the functionalities you need for your app.
​

For full documentation, please head to __[LiveChat Docs](https://developers.livechatinc.com/docs/feature/chat-sdk/messaging/chat-sdk/)__.
​
## Installation
​
The package can be installed directly from NPM.
​
```
npm i @livechat/chat-sdk
```
​
## Initial configuration
​
###
| Parameter         | Required | Data type | Notes                                                    |
| ----------------- | -------- | --------- | -------------------------------------------------------- |
| apiVersion        | `false`  | `string`  | Call a different API version than the default one.       |
| debug             | `false`  | `boolean` | Display all messages exchanged with the LiveChat API.    |
| region            | `false`  | `string`  | Specify a data center. Possible values:`europe` and `america` (default). |
​
```js
const chatSDK = new ChatSDK({ debug: true })
```
​
## Methods
​
### init
​
It intializes the WebSocket connection, attaches event listeners, and then logs in the Agent.
​
```js
chatSDK.init({
    access_token: access_token
})
```


  #### Parameters

  | Parameter      | Required | Data type | Notes                                                                                                  |
 | -------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------ |
 | `access_token` |   Yes    | `object`  | See [Authorization](#authorization) to learn how to get an access token. Optionally, you can acquire it directly from [Accounts SDK](/getting-started/authorization/sign-in-with-livechat/#sdk-documentation) and pass it in to the `init()` method. The **Simple Agent** app uses this mechanism. |

​
### destroy
​
It clears any stored resources, removes all listeners, and disconnects from the network. After using this method you won't be able to use the destroyed SDK instance.
​
```js
chatSDK.destroy()
```
​
### getAgentDetails
​
It allows you to get information about the currently logged in Agent.
​

```js     
chatSDK.getAgentDetails() 
    .then(agentData => {
        // access to the agentData object
    }) 
    .catch(error => {
        // catch an error object
    })
 ```
​
### sendMessage
​
It sends a plain text message.
​
#### Arguments
| Argument   | Data type | Notes                                       |
| ---------- | --------- | ------------------------------------------- |
| chat_id    | `string`  | Id of chat that you want to send a message to. |
| message    | `string`  | Message content                             |
| recipients | `string`  | Possible values: `all` (default), `agents`  |
​
#### Returned value 
| Value      | Data type |
| ---------- | --------- |
| event_id   | `string`  |
​
```js
const chatId = 'PJ0MRSHTDG'
const message = 'Hello world'
​
chatSDK.sendMessage(chatId, message)
    .then(event => {
        // get event_id or handle a success scenario
    })
    .catch(error => {
        // catch an error object
    })
```
​
### How to create other methods - methodFactory
​
This SDK supports the RTM transport. For that reason, make sure you use the [Agent Chat API RTM](https://developers.labs.livechatinc.com/docs/feature/chat-sdk/messaging/agent-chat-api/rtm-reference) reference. When creating your custom methods, base on the payloads from the [Agent Chat RTM API methods](https://developers.labs.livechatinc.com/docs/feature/chat-sdk/messaging/agent-chat-api/rtm-reference/#methods).
​
In the example below, we're creating a custom method that returns chat thread summaries. As you can see in the [documentation](https://developers.labs.livechatinc.com/docs/feature/chat-sdk/messaging/agent-chat-api/rtm-reference/#get-chat-threads-summary), only `chat_id` is required, but you can include other optional parameters in your custom method.
​
```js
const getChatThreadsSummary = (chatId) => chatSDK.methodFactory({
    action: "get_chat_threads_summary",
    payload: { "chat_id": chatId }
})
​
getChatThreadsSummary("PJ0MRSHTDG")
    .then(data => {
        // get a list of thread summaries
    })
    .catch(error => {
        // catch an error
    })
```
## on
​
The on method subscribes to emitted events.
​
```js
chatSDK.on("event_name", (data) => {
    console.log(data)
})
```
Here's what you can listen for:

  | Event name   | Action     | 
 | ------------ | ---------- |
 | `ready`      | You've been successfully logged in. You're now ready to use all API methods. |
 |  Pushes      | Refer to [documentation](/messaging/agent-chat-api/rtm-reference/#pushes).   |


## once
​
The once method subscribes to emitted events and unsubscribes right after the callback function has been called.
​
```js
chatSDK.once("event_name", (data) => {
    console.log(data)
})
```
​
## off
​
The off method unsubsribes from emitted events.
​
```js
chatSDK.off("event_name", (data) => {
    console.log(data)
})
```
​
## Simple Agent - Example

To show you **Chat SDK** in action, we've prepared a sample app, **Simple Agent** . It's primary function is to send text messages. Apart from that, it gives you access to previous conversations, 
as well as the info about the current Agent.

To run the app, follow these 3 steps:

1. [Create an app](/getting-started/guides/#creating-livechat-apps) in Developer Console. You need it to get **Client Id**. Once the app is created, you can find your **Client Id** in
**Building Blocks -> Authorization** in Developer Console.

2. Paste your **Client Id** into the `.env` file in `/example` folder.

3. Run **Simple Agent** with the following commands:

```js
npm run install-example //install dependencies 

npm run start-example //start the app
```

To start a chat, log in to you LiveChat account and choose the **Preview live** option available in the **Settings** tab. You'll now be able to receive messages and respond to them from within **Simple Agent**.

It's worth mentioning that all functions invoked before logging in are queued. Once you're logged in, they are executed in the same order as they were invoked.  

## Feedback
​
If you find some bugs or have trobules implementing the code on your own, please create an issue on this repo.
​
## If you're new to LiveChat
​
LiveChat is an online customer service software with live support, help desk software, and web analytics capabilities. It's used by more than 28,000 companies all over the world. For more info, check out [LiveChat for Developers](https://developers.livechatinc.com).