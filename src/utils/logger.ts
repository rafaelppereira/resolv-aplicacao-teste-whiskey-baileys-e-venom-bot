import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino',
    options: {
      levelFirst: true,
      translateTime: true,
      colorize: true,
    },
  },
});

export { logger };
