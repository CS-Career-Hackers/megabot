import Event from '../models/Event';
import EventModel from '../models/Event';
import { MongoMemoryServer } from 'mongodb-memory-server';
import client from '../../../client';
import editEvent from '../subCommands/editEvent';
import { escapedBackticks } from '../../../utils';
import mongoose from 'mongoose';
import 'babel-polyfill';

describe('adding Event', () => {
  let uri;

  test('ama does returns example when no arguments supplied', async () => {
    await editEvent.handler([]);

    expect(client.message.channel.send)
      .toHaveBeenCalledWith(`Surround values with triple backticks and split by double newline. For example:
++ama edit 5fd3f9a4ea601010fe5875ff
${escapedBackticks}url: https://cscareerhub.com

date: 2020-12-25

description: Line 1
Line 2

title: Sample Event

participants: Kevin, Kevin Jr${escapedBackticks}`);
  });

  test('ama does no edits when invalid argument supplied', async () => {
    await editEvent.handler(['abc123']);

    expect(client.message.channel.send).toHaveBeenCalledWith(
      'Event with id abc123 not found'
    );
  });

  test('ama does no edits when target Event is not found', async () => {
    await editEvent.handler(['5fd3f9a4ea601010fe5875ff']);

    expect(client.message.channel.send).toHaveBeenCalledWith(
      'Event with id 5fd3f9a4ea601010fe5875ff not found'
    );
  });

  test('ama does no edits when code block not created', async () => {
    let event = await Event({
      date: new Date('2015-05-01T12:00:00Z'),
      title: 'Event 1'
    }).save();

    client.message.content = event.id;

    await editEvent.handler([event.id]);
    await EventModel.deleteMany({});

    expect(client.message.channel.send).toHaveBeenCalledWith(
      'Must surround data with backticks (codeblock)'
    );
  });

  test('ama edits and prints out updated info', async () => {
    let event = await Event({
      date: new Date('2015-05-01T12:00:00Z'),
      participants: ['Person 1', 'Person 2'],
      title: 'Event 1'
    }).save();

    client.message.content = `++ama edit ${event.id}
${escapedBackticks}
title: Event 2

url: https://cscareerhub.com
${escapedBackticks}`;

    await editEvent.handler([event.id]);

    let newEvent = await EventModel.findOne({});
    await EventModel.deleteMany({});

    expect(client.message.channel.send)
      .toHaveBeenCalledWith(`${escapedBackticks}
Event title: Event 2
Date: Fri May 01 2015
URL: https://cscareerhub.com
Participant(s): Person 1, Person 2
Description: ${escapedBackticks}`);

    expect(newEvent.title).toEqual('Event 2');
    expect(newEvent.url).toEqual('https://cscareerhub.com');
    expect(newEvent.date).toEqual(event.date);
    expect(newEvent.participants.sort().toString()).toEqual(
      event.participants.sort().toString()
    );
  });

  beforeAll(async () => {
    client.message = {
      channel: {
        send: jest.fn()
      }
    };

    const mongod = new MongoMemoryServer();
    uri = await mongod.getUri();
  });

  beforeEach(async () => {
    mongoose.set('useFindAndModify', false);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
});
