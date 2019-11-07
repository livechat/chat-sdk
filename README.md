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
| Parameter         | Required | Data type | Notes                                                    |
| ----------------- | -------- | --------- | -------------------------------------------------------- |
| account_token     | `true`   | `string`  | An access token authorizing you with the Agent Chat API. |
| apiVersion        | `false`  | `string`  | Call a different API version than the default one.       |
| debug             | `false`  | `boolean` | Display all messages exchanged with the LiveChat API.    |
| region            | `false`  | `string`  | Specify a data center. Possible values:`europe` and `america` (default). |
​
```js
const chatSDK = new ChatSDK({ account_token: TOKEN })
```
​
## Methods
​
### init
​
It intializes the WebSocket connection, attaches event listeners, and then logs in the Agent.
​
```js
chatSDK.init() 
```
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
        // access to the agent data object
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
​
Here's what you can listen for:

| EVENT NAME    | ACTION                          |
| ------------- | ------------------------------- |
| `connect`	    | Websocket connection started    |
| `disconnect`	| Websocket connection ended      |
| Pushes	    | Refer to [documentation](https://developers.labs.livechatinc.com/docs/feature/chat-sdk/messaging/agent-chat-api/rtm-reference/#pushes)          |

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
## Feedback
​
If you find some bugs or have trobules implementing the code on your own, please create an issue on this repo.
​
## If you're new to LiveChat
​
LiveChat is an online customer service software with live support, help desk software, and web analytics capabilities. It's used by more than 28,000 companies all over the world. For more info, check out [LiveChat for Developers](https://developers.livechatinc.com).