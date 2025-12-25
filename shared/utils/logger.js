'use strict';

const LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();

  if (meta) {
    return `[${timestamp}] [${level}] ${message} | ${JSON.stringify(meta)}`;
  }

  return `[${timestamp}] [${level}] ${message}`;
};

const write = (level, message, meta) => {
  const formatted = formatMessage(level, message, meta);

  if (level === LEVELS.ERROR) {
    console.error(formatted);
  } else if (level === LEVELS.WARN) {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }
};

export const logger = Object.freeze({
  info(message, meta = null) {
    write(LEVELS.INFO, message, meta);
  },

  warn(message, meta = null) {
    write(LEVELS.WARN, message, meta);
  },

  error(message, meta = null) {
    write(LEVELS.ERROR, message, meta);
  },
});

