# Mattermost ETL [![CircleCI](https://circleci.com/gh/Brightscout/mattermost-etl.svg?style=shield&circle-token=3e834193f471812ea72217332aa0f5ff36825afe)](https://circleci.com/gh/Brightscout/mattermost-etl) [![Code Climate](https://codeclimate.com/github/Brightscout/mattermost-etl/badges/gpa.svg)](https://codeclimate.com/github/Brightscout/mattermost-etl) [![Test Coverage](https://codeclimate.com/github/Brightscout/mattermost-etl/badges/coverage.svg)](https://codeclimate.com/github/Brightscout/mattermost-etl/coverage)

An ETL framework to migrate data from Jabber to Mattermost. This utility exports data from a source Jabber database and generates a [Mattermost Bulk Loading](https://docs.mattermost.com/deployment/bulk-loading.html) import file. Eventually, we'll enhance this project to support migration from other messaging sources.  



## Install

1. Install [Node.js](https://nodejs.org/en/) Version [6.11.0 LTS](https://nodejs.org/en/download/) or greater

2. Clone this repo  
`$ git clone https://github.com/Brightscout/mattermost-etl`

3. Install dependencies  
`$ cd mattermost-etl`  
`$ npm install` or `$ yarn install`

4. Run tests  
`$ npm test`

## Configure

1. Copy the example config file to config.js  
`$ cp context/config.example.js context/config.js`

2. Modify the values in `context/config.js` for the source, target, and team properties.

## Export

1. Execute the ETL exporter  
`$ npm start`

2. Inspect the output file, `data.json`, or whatever you set as the target filename. Ensure the results are as [expected](https://docs.mattermost.com/deployment/bulk-loading.html#data-format).

## Import

1. Run the Mattermost bulk loading command as explained [here](https://docs.mattermost.com/deployment/bulk-loading.html#running-the-bulk-loading-command)  
---

Made with &#9829; by [Brightscout](http://www.brightscout.com)
