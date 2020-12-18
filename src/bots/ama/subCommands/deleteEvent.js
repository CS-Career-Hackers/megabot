import EventModel from '../models/Event';
import client from '../../../client';
import { getStrings } from '../constants';
import { isMod } from '../../../utils/perms';

/**
 * Handles deleting an event with Event schema
 * @param {Array.<string>} args - rest of command arguments
 */
const handler = async (args) => {
  if (!isMod(client.message.member)) {
    client.message.channel.send(getStrings().insufficientPermissions);
    return;
  }

  if (args.length !== 1) {
    client.message.channel.send(getStrings().insufficientArgumentsEvent);
    return;
  }

  let deleted;
  let targetId = args[0];

  try {
    deleted = await EventModel.findOneAndDelete({ _id: targetId });
  } catch {
    client.logger.debug('invalid ObjectId type supplied');
  }

  if (deleted) {
    client.message.channel.send(getStrings(targetId).successfullyDeleted);
  } else {
    client.message.channel.send(getStrings(targetId).eventNotFound);
  }
};

const deleteEvent = {
  example: 'delete 5fd3f9a4ea601010fe5875ff',
  handler,
  usage: 'Specify object ID supplied in `++ama list -i`'
};

export default deleteEvent;
