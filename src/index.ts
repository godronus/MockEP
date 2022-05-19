import AWS from 'aws-sdk';
import 'cross-fetch/polyfill';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { generateParkAvailability } from './data';

dotenv.config();
AWS.config.update({region: 'eu-west-2'});
const SQS = new AWS.SQS();
const QueueUrl = process.env.SQS_CACHE_QUEUE ?? '';


const availability1 = generateParkAvailability({
  park_code: 'EP',
  gold: {
    starting_date: '2022/01/01',
    total_available_dates: 2,
    was_price_per_night: 150,
    price_per_night: 100,
    total_available_units: 5
  },
  silver: {
    starting_date: '2022/01/01',
    total_available_dates: 5,
    was_price_per_night: 100,
    price_per_night: 80,
    total_available_units: 5
  },
  bronze: {
    starting_date: '2022/01/01',
    total_available_dates: 3,
    was_price_per_night: 80,
    price_per_night: 75,
    total_available_units: 5
  }
});


console.log('TCL: availability1', availability1)
const sendToQueue = (records) => {
  if (QueueUrl) {
    records.map((record) => {
			console.log('TCL: sendToQueue -> record', record)
      // This may need to be async...await
      SQS.sendMessageBatch({ Entries: [{
        Id: uuid(),
        MessageBody: JSON.stringify(record),
      }], QueueUrl }).promise();
    })
  }
}

const EP_WEBHOOK_URL = 'https://0kbkg96ao7.execute-api.eu-west-2.amazonaws.com/default/niobe_availability-ep-webhook__production';
const sleep = (millis = 200) => new Promise((resolve) => setTimeout(resolve, millis))
const sendToLambda = async (records) => {
  for (const record of records) {
    await sleep();
    fetch(EP_WEBHOOK_URL, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
  }
}

// sendToQueue(availability1);
sendToLambda(availability1);
