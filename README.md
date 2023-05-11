# Red Alert Slack notifications

This simple Node.js project will connect to your slack channel and will send Red Alert events from Pikud ha Oref in Israel.

It can run independently as a node.js process or in a docker container.

## Before you start

Get a channel up and running with an incoming webhook.

It should look like this:

`https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

You should use the last part of the URL -

`T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

as "TOKENS" in this doc.

### Options


| Option  | Default value | Description                                                            |
| --------- | --------------- | ------------------------------------------------------------------------ |
| DEBUG   | false         | Shows console.log                                                      |
| TOKENS  | null          | Your slack tokens - token1/token2/token3                               |
| CITIES  | null          | Specific cities seperated by a comma. Null will send all notifications |
| SECONDS | 10            | Number of seconds to pull an alert                                     |
| DEMO    | false         | Demo mode, for checking your notifications                             |

## Run as a Node process - example

`DEBUG=true TOKENS=token1/token2/token3 CITIES="בת-ים,יבנה" node index.js`

## Run with docker

### Build:

`docker build -t redalert-slack .`

### Run with:

`docker run -e DEBUG=true -e TOKENS=token1/token2/token3 -e CITIES="בת-ים,יבנה" -d --name redalert-slack redalert-slack`
