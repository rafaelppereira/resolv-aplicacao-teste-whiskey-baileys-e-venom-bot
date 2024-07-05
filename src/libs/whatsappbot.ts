/* eslint-disable @typescript-eslint/no-var-requires */
import makeWASocket, {
  Browsers,
  DisconnectReason,
  WASocket,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
} from '@whiskeysockets/baileys';
import { Store } from './store';
import MAIN_LOGGER from '@whiskeysockets/baileys/lib/Utils/logger';
import { Connection } from '@prisma/client';
import { PrismaService } from '@/infra/prisma/prisma.service';
import authState from '@/helpers/authState';
import { logger } from '@/utils/logger';
import { Boom } from '@hapi/boom';
import { getIO } from './socket';

const loggerBaileys = MAIN_LOGGER.child({});
loggerBaileys.level = 'error';

type Session = WASocket & {
  id?: number;
  store?: Store;
};

const sessions: Session[] = [];

const retriesQrCodeMap = new Map<number, number>();

export const getWhatsappbot = (whatsappId: number): Session => {
  const sessionIndex = sessions.findIndex((s) => s.id === whatsappId);

  if (sessionIndex === -1) {
    throw new Error('ERR_WAPP_NOT_INITIALIZED');
  }

  return sessions[sessionIndex];
};

export const removeWhatsappbot = async (
  whatsappId: number,
  isLogout = true,
): Promise<void> => {
  try {
    const sessionIndex = sessions.findIndex((s) => s.id === whatsappId);
    if (sessionIndex !== -1) {
      if (isLogout) {
        sessions[sessionIndex].logout();
        sessions[sessionIndex].ws.close();
      }

      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    console.log(err);
  }
};

export const initWASocket = async (
  connectionData: Connection,
  prisma: PrismaService,
): Promise<Session> => {
  return new Promise(async (resolve, reject) => {
    try {
      (async () => {
        const io = getIO();

        const findConnection = await prisma.connection.findUnique({
          where: {
            id: connectionData.id,
          },
        });

        console.log('FIND CONNECTION => ', findConnection);
        if (!findConnection) return null;

        const { id } = findConnection;
        let retriesQrCode = 0;

        let wsocket: Session = null;
        const store = makeInMemoryStore({
          logger: loggerBaileys,
        });

        const { version } = await fetchLatestBaileysVersion();
        const { state, saveState } = await authState(connectionData, prisma);

        wsocket = makeWASocket({
          logger: loggerBaileys,
          printQRInTerminal: false,
          browser: Browsers.appropriate('Desktop'),
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
          },
          version,
          shouldIgnoreJid: (jid) => isJidBroadcast(jid),
        });

        wsocket.ev.on(
          'connection.update',
          async ({ connection, lastDisconnect, qr }) => {
            console.log('CONNECTION => ', connection);
            if (connection === 'close') {
              if ((lastDisconnect?.error as Boom)?.output?.statusCode === 403) {
                const connectionUpdate = await prisma.connection.update({
                  where: {
                    id: connectionData.id,
                  },
                  data: {
                    status: 'PENDING',
                    session: '',
                  },
                });

                io.to(
                  `organization-${findConnection.organizationId}-mainchannel`,
                ).emit(
                  `organization-${findConnection.organizationId}-whatsappSession`,
                  {
                    action: 'update',
                    session: connectionUpdate,
                  },
                );

                removeWhatsappbot(id, false);
              }

              if (
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut
              ) {
                removeWhatsappbot(id, false);

                setTimeout(async () => {
                  io.to(
                    `organization-${findConnection.organizationId}-mainchannel`,
                  ).emit('whatsappSession', {
                    action: 'update',
                    connectionData,
                  });

                  try {
                    // TODO: Inicia o WASocket do WhiskeyBaileys
                    await initWASocket(findConnection, prisma);
                  } catch (error) {
                    console.log(error);
                  }
                }, 2000);
              } else {
                const connectionUpdate = await prisma.connection.update({
                  where: {
                    id: connectionData.id,
                  },
                  data: {
                    status: 'PENDING',
                    session: '',
                  },
                });

                io.to(
                  `organization-${findConnection.organizationId}-mainchannel`,
                ).emit(
                  `organization-${findConnection.organizationId}-whatsappSession`,
                  {
                    action: 'update',
                    session: connectionUpdate,
                  },
                );

                removeWhatsappbot(id, false);

                setTimeout(async () => {
                  io.to(
                    `organization-${findConnection.organizationId}-mainchannel`,
                  ).emit('whatsappSession', {
                    action: 'update',
                    findConnection,
                  });

                  try {
                    // TODO: Inicia o WASocket do WhiskeyBaileys
                    await initWASocket(findConnection, prisma);
                  } catch (error) {
                    console.log(error);
                  }
                }, 2000);
              }
            }

            if (connection === 'open') {
              const connectionUpdate = await prisma.connection.update({
                where: {
                  id: connectionData.id,
                },
                data: {
                  status: 'CONNECTED',
                  qrcode: '',
                  retries: 0,
                },
              });

              io.to(
                `organization-${findConnection.organizationId}-mainchannel`,
              ).emit(
                `organization-${findConnection.organizationId}-whatsappSession`,
                {
                  action: 'update',
                  session: connectionUpdate,
                },
              );

              const sessionIndex = sessions.findIndex(
                (s) => s.id === findConnection.id,
              );
              if (sessionIndex === -1) {
                wsocket.id = findConnection.id;
                sessions.push(wsocket);
              }

              resolve(wsocket);
            }

            if (qr !== undefined) {
              if (retriesQrCodeMap.get(id) && retriesQrCodeMap.get(id) >= 3) {
                const connectionUpdate = await prisma.connection.update({
                  where: {
                    id: connectionData.id,
                  },
                  data: {
                    status: 'DISCONNECTED',
                    qrcode: '',
                  },
                });

                io.to(
                  `organization-${findConnection.organizationId}-mainchannel`,
                ).emit(
                  `organization-${findConnection.organizationId}-whatsappSession`,
                  {
                    action: 'update',
                    session: connectionUpdate,
                  },
                );

                wsocket.ev.removeAllListeners('connection.update');
                wsocket.ws.close();
                wsocket = null;
                retriesQrCodeMap.delete(id);
              } else {
                console.log('QRCODE => ', qr);
                retriesQrCodeMap.set(id, (retriesQrCode += 1));

                const connectionUpdate = await prisma.connection.update({
                  where: {
                    id: connectionData.id,
                  },
                  data: {
                    qrcode: qr,
                    status: 'qrcode',
                    retries: 0,
                  },
                });

                const sessionIndex = sessions.findIndex(
                  (s) => s.id === findConnection.id,
                );

                if (sessionIndex === -1) {
                  wsocket.id = findConnection.id;
                  sessions.push(wsocket);
                }

                io.to(
                  `organization-${findConnection.organizationId}-mainchannel`,
                ).emit(
                  `organization-${findConnection.organizationId}-whatsappSession`,
                  {
                    action: 'update',
                    session: connectionUpdate,
                  },
                );
              }
            }
          },
        );

        wsocket.ev.on('creds.update', saveState);

        store.bind(wsocket.ev);
      })();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
