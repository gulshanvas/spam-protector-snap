import type { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { SeverityLevel, divider, heading, image, panel, row, text } from '@metamask/snaps-sdk';

import {hasProperty} from '@metamask/utils'

import { ALL_EOA_QUERY } from './queries';

import {
  STATUS,
  SUCCESS_MESSAGES_TO_USER,
  FAILURE_MESSAGES_TO_USER,
  AIRSTACK_URL,
} from './constants';

const airstack = require('@airstack/node');

const AIRSTACK_KEY = 'c6425f6b2191483ca9e019a96b868561';

airstack.init(AIRSTACK_KEY);


/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {

  const variables = {
    from: transaction.from,
    to: transaction.to,
  };

  let finalStatus = STATUS[0];
  let insightPanel = [];

  let connectionScore = 0;
  let descriptions = [];

  if (
    hasProperty(transaction, 'data') &&
    typeof transaction.data === 'string'
  ) {
    // smart contract
  } else {
    // EOA interaction
    ({ connectionScore, descriptions } = await processEOA(variables))

      if (connectionScore == 1) {
        finalStatus = STATUS[1]; // CONNECTED
      } else if (connectionScore > 1) {
        finalStatus = STATUS[2]; // STRONGLY CONNECTED
      }

      insightPanel.push(heading(`Status : ${finalStatus}`));
      insightPanel.push(divider());

      for (let i = 0; i < descriptions.length; i++) {
        const description = descriptions[i];
        insightPanel.push(description);
      }

      // no connection found
      if (descriptions.length == 0) {
        insightPanel.push(
          text(FAILURE_MESSAGES_TO_USER.NO_TRANSFER_HISTORY_FOUND),
        );
        insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_COMMON_FOLLOWERS));
        insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_RECEIVER_HISTORY));
        insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_FOLLOW_EACH_OTHER));
        insightPanel.push(
          text(FAILURE_MESSAGES_TO_USER.NO_RECEIVER_NON_VIRTUAL_POAP),
        );
      }

      return {
        content: panel(insightPanel),
        // severity: SeverityLevel.Critical,
      };

  }

};

const processEOA = async(
  variables: any,
) => {
    const data = await fetch(AIRSTACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: ALL_EOA_QUERY, variables }),
    }).then((response) => {
      return response.json();
    });

    const ethereumTokenTransfer = data.data['hasEthereumTokenTransfers'];
    const polygonTokenTransfer = data.data['hasPolygonTokenTransfers'];
    const tokenTranferConnect = checkIfAlreadyTransferHistroyBetweenFromTo(
      ethereumTokenTransfer,
      polygonTokenTransfer,
    );

    let connectionScore = 0;

    let descriptions = [];
    if (tokenTranferConnect) {
      connectionScore++;
      descriptions.push(text(SUCCESS_MESSAGES_TO_USER.TRANSFER_HISTORY_FOUND));
    }

    const commonFollowerConnect = commonFollowersOnLensAndFascaster(
      data.data['hasCommonFollowersLensOrFarcaster']?.Follower,
    );

    if (commonFollowerConnect) {
      descriptions.push(text(SUCCESS_MESSAGES_TO_USER.COMMON_FOLLOWERS));

      connectionScore++;
    }

    const doesReceiverHasStrongTransferHistory =
      checkIfReceiverHasStronglTransferHistory(data);

    if (doesReceiverHasStrongTransferHistory) {
      descriptions.push(text(SUCCESS_MESSAGES_TO_USER.RECEIVER_HISTORY));
      connectionScore++;
    }

    const doesBothUserStronglyFollowsEachOther =
      doesBothUserStronglyFollowEachOther(data);

    if (doesBothUserStronglyFollowsEachOther) {
      descriptions.push(text(SUCCESS_MESSAGES_TO_USER.FOLLOW_EACH_OTHER));
      connectionScore++;
    }

    const isNonVirtualPoapAttended = checkIfNonVirtualPOAPAttended(
      data.data['hasPoaps']['Poap'],
    );

    if (isNonVirtualPoapAttended) {
      descriptions.push(
        text(SUCCESS_MESSAGES_TO_USER.RECEIVER_NON_VIRTUAL_POAP),
      );
      connectionScore++;
    }
  
  return {
    connectionScore,
    descriptions
  }
}

/**
 * It validates whether `sender` has transfer history on ethereum and polygon
 * @param ethereumTokenTransfer Object of User A has transferred to user B on ethereum
 * @param polygonTokenTransfer Object of User A has transferred to user B on polygon
 * @returns 
 */
const checkIfAlreadyTransferHistroyBetweenFromTo = (
  ethereumTokenTransfer: any,
  polygonTokenTransfer: any,
) => {
  return ethereumTokenTransfer?.TokenTransfer?.length || polygonTokenTransfer?.TokenTransfer?.length;
}

/**
 * It validates if user has transfer history on ethereum and polygon
 * 
 * @param ethereumFromTransferHistory Address transfer history on ethereum
 * @param polygonFromTransferHistory Address transfer history on polygon
 * @returns 
 */
const checkIfToAddressHasTransferHistory = (
  ethereumFromTransferHistory: any,
  polygonFromTransferHistory: any,
) => {
  return (
    ethereumFromTransferHistory?.TokenTransfer?.length ||
    polygonFromTransferHistory?.TokenTransfer?.length
  );

}

/**
 * It validates if user's follow each other
 * @param socialFollowing 
 * @returns 
 */
const doesBothUserFollowEachOther = (
  socialFollowing: any
) => {
  const following = socialFollowing?.Following;

  if (!following) {
    return false;
  }
  
  return following?.length > 0;
}

/**
 * It validates if :
 *    1. Two users have common POAP
 *    2. Has lens profile
 *    3. Has farcaster account
 *    4. Has Primary ENS
 *    5. Does `sender` follows `receiver` on fascaster and lens platforms (Mandatory)
 * 
 *  From the above 5th point is mandatory and must satisfy atleast 1 point from
 *  1 to 4 points
 * @param data 
 * @returns 
 */
const doesBothUserStronglyFollowEachOther = (
  data : any
) => {
  const isCommonPOAPEventsAttended = commonPOAPEventsAttended(data);
  const doesUserHasLensProfile = hasLensProfile(data.data['hasLens']);
  const doesUserHasFarcasterProfile = hasFarCasterAccount(
    data.data['hasFarcaster'],
  );
  const doesUserHasPrimaryENS = hasPrimaryENS(data.data['hasPrimaryENS']);

  const isFromUserFollowsTo = doesBothUserFollowEachOther(
    data.data['hasSocialFollowing']['socialFollowings'],
  );

  // Notice: It is done because there is a bug in Social following api
  // when new address is used which doesnt have any socials
  const fromSocial = doesFromAddressHasSocial(data.data['fromSocialInfo']);
  const toSocial = doesToAddressHasSocial(data.data['toSocialInfo']);

  if (fromSocial && toSocial) {
    return (
      isFromUserFollowsTo &&
      (isCommonPOAPEventsAttended ||
        doesUserHasLensProfile ||
        doesUserHasFarcasterProfile ||
        doesUserHasPrimaryENS)
    );
  } 

  return false
}

const doesFromAddressHasSocial = (fromSocialInfo: any) => {

  if (!fromSocialInfo) {
    return false;
  }

  return fromSocialInfo?.socials?.length > 0;

}

const doesToAddressHasSocial = (toSocialInfo: any) => {
    if (!toSocialInfo) {
      return false;
    }

    return toSocialInfo?.socials?.length > 0;

};

/**
 * It validates if two users has common farcaster and lens followers
 * 
 * @param commonFollowersOnSocials Social object
 * @returns 
 */
const commonFollowersOnLensAndFascaster = (
  commonFollowersOnSocials: any // lens or farcaster
) => {
  let isCommonFollowerPresent = false;

  if (!commonFollowersOnSocials) {
    return isCommonFollowerPresent;
  }
    for (let i = 0; i < commonFollowersOnSocials.length; i++) {
      const followerObj = commonFollowersOnSocials[i];
      // if(isCommonFollowerPresent)
      const followerList =
        followerObj?.followerAddress?.socialFollowers?.Follower || [];

      if (followerList && followerList.length > 0) {
        console.log('followerObj ', followerObj);
        isCommonFollowerPresent = true;
        break;
      }
    }
  
  return isCommonFollowerPresent;


}

/**
 * It validates if :
 *    1. Two users have common POAP
 *    2. Has lens profile
 *    3. Has farcaster account
 *    4. Has Primary ENS
 *    5. Does `receiver` has transfer history with `sender` on fascaster and lens platforms (Mandatory)
 * 
 *  From the above 5th point is mandatory and must satisfy atleast 1 point from
 *  1 to 4 points 
 * 
 * @param data Entire Data object
 * @returns 
 */
const checkIfReceiverHasStronglTransferHistory = (data:any) => {

  const isCommonPOAPEventsAttended = commonPOAPEventsAttended(data);
  const doesUserHasLensProfile = hasLensProfile(data.data['hasLens']);
  const doesUserHasFarcasterProfile = hasFarCasterAccount(
    data.data['hasFarcaster'],
  );
  const doesUserHasPrimaryENS = hasPrimaryENS(data.data['hasPrimaryENS']);

  const doesToUserHasTransferHistory = checkIfToAddressHasTransferHistory(
    data.data['ethereumFromTokenTransfer'],
    data.data['polygonFromTokenTransfer'],
  );

  return (
    doesToUserHasTransferHistory &&
    (isCommonPOAPEventsAttended ||
      doesUserHasLensProfile ||
      doesUserHasFarcasterProfile ||
      doesUserHasPrimaryENS)
  );

}

/**
 * It validates whether there are any common POAPs between two users 
 * @param data data object received 
 * @returns 
 */
const commonPOAPEventsAttended = (data: any) => {
    const commonPOAPs = data.data['hasCommonPoaps']['Poap'];

  if (!commonPOAPs) {
    return false;
  }

    for (let i = 0; i < commonPOAPs.length; i++) {
      const poap = commonPOAPs[i];
      const isEventPresent = poap['poapEvent']['poaps'];
      console.log('isEventPresent ', isEventPresent);
      if (isEventPresent) {
        console.log('event present');
        return true;
      }
    }
  
  return false;

}

/**
 * It validates whether user has lens profile
 * 
 * @param lensData Lens data of the suer
 * @returns 
 */
const hasLensProfile = (lensData: any) => {
    const lensProfile = lensData['Social'];

    if (!lensProfile) {
      return false;
    }

    if (lensProfile.length > 0) {
      return true;
    }
  
  return false;
 };

 /**
 * It validates whether user has farcaster account
 * 
 * @param farcasterData Farcaster details of the user
 * @returns 
 */
const hasFarCasterAccount = (farcasterData: any) => {
  const farcasterProfile = farcasterData['Social'];

  if (!farcasterProfile) {
    return false;
  }

  if (farcasterProfile.length > 0) {
    return true;
  }

  return false;
};

/**
 * It validates whether user has primary ENS
 * 
 * @param ensData ENS Data of user
 * @returns 
 */
const hasPrimaryENS = (
  ensData: any
) => {
  const ensDomainInfo = ensData['Domain'];

  if (!ensDomainInfo) {
    return false;
  }

  if (ensDomainInfo.length > 0) {
    return true;
  }

  return false;
}

/**
 * It checks if user has attended non-virtual POAP
 * 
 * @param poap Poap object 
 * @returns bool
 */
const checkIfNonVirtualPOAPAttended = (
  poap: any
) => {

  let isNonVirtualPoapAttended = false;
  const poapsData = poap;

  if (!poapsData) {
    return isNonVirtualPoapAttended;
  }

    for (let i = 0; i < poapsData.length; i++) {
      const poap = poapsData[i];
      const poapEvent = poap['poapEvent'];
      if (!poapEvent.isVirtualEvent) {
        console.log('poap : ', poap);
        console.log('attended non virtual event');
        isNonVirtualPoapAttended = true;
        break;
      }
    }

  return isNonVirtualPoapAttended;
}