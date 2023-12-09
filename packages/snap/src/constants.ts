export const SYMBOLS = {
  CORRECT: '✅',
  INCORRECT: '❌',
};

export const STATUS = {
    0: 'Stay cautious !!!',
    1: 'Connected',
    2: 'Strongly Connected',
};
  

export const SUCCESS_MESSAGES_TO_USER = {
  TRANSFER_HISTORY_FOUND: `${SYMBOLS.CORRECT} Previous transfer history present `,
  COMMON_FOLLOWERS: `${SYMBOLS.CORRECT} Common follower on lens and fascaster`,
  RECEIVER_HISTORY: `${SYMBOLS.CORRECT} Receiver has transfer history `,
  FOLLOW_EACH_OTHER: `${SYMBOLS.CORRECT} You both follow each other`,
  RECEIVER_NON_VIRTUAL_POAP: `${SYMBOLS.CORRECT} Receiver has non virtual POAP`,
};

export const FAILURE_MESSAGES_TO_USER = {
  NO_TRANSFER_HISTORY_FOUND: `${SYMBOLS.INCORRECT} No previous history found`,
  NO_COMMON_FOLLOWERS: `${SYMBOLS.INCORRECT} No common followers on farcaster and lens`,
  NO_RECEIVER_HISTORY: `${SYMBOLS.INCORRECT} No transfer history with receiver`,
  NO_FOLLOW_EACH_OTHER: `${SYMBOLS.INCORRECT} You both don't follow each other on farcaster and lens`,
  NO_RECEIVER_NON_VIRTUAL_POAP: `${SYMBOLS.INCORRECT} Receiver do not have non-virtual POAP`,
};


export const AIRSTACK_URL = 'https://api.airstack.xyz/gql';


