import { PrismaService } from '@/infra/prisma/prisma.service';
import { Connection } from '@prisma/client';
import type {
  AuthenticationCreds,
  AuthenticationState,
  SignalDataTypeMap,
} from '@whiskeysockets/baileys';
import { BufferJSON, initAuthCreds, proto } from '@whiskeysockets/baileys';

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
  'pre-key': 'preKeys',
  session: 'sessions',
  'sender-key': 'senderKeys',
  'app-state-sync-key': 'appStateSyncKeys',
  'app-state-sync-version': 'appStateVersions',
  'sender-key-memory': 'senderKeyMemory',
};

const authState = async (
  connection: Connection,
  prisma: PrismaService,
): Promise<{ state: AuthenticationState; saveState: () => void }> => {
  let creds: AuthenticationCreds;
  let keys: any = {};

  const saveState = async () => {
    try {
      await prisma.connection.update({
        where: {
          id: connection.id,
        },
        data: {
          session: JSON.stringify({ creds, keys }, BufferJSON.replacer, 0),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (connection.session && connection.session !== null) {
    const result = JSON.parse(connection.session, BufferJSON.reviver);
    creds = result.creds;
    keys = result.keys;
  } else {
    creds = initAuthCreds();
    keys = {};
  }

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict: any, id) => {
            let value = keys[key]?.[id];
            if (value) {
              if (type === 'app-state-sync-key') {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (data: any) => {
          for (const i in data) {
            const key = KEY_MAP[i as keyof SignalDataTypeMap];
            keys[key] = keys[key] || {};
            Object.assign(keys[key], data[i]);
          }
          saveState();
        },
      },
    },
    saveState,
  };
};

export default authState;
