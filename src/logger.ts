export enum LOG_LEVEL {
  error,
  info,
  debug,
}

export const logger = (msg, level = LOG_LEVEL.info) => {
  if (Number(process.env.NODE_ENV) < level) {
    return;
  }
  switch (level) {
    case LOG_LEVEL.debug: {
      console.log(msg);
      return;
    }
    case LOG_LEVEL.info: {
      console.info(msg);
      return;
    }
    case LOG_LEVEL.error: {
      console.error(msg);
      return;
    }
  }
};