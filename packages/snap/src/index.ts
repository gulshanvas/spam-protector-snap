import type { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { SeverityLevel, divider, heading, image, panel, row, text } from '@metamask/snaps-sdk';

const airstack = require('@airstack/node');

const AIRSTACK_KEY = 'c6425f6b2191483ca9e019a96b868561';

airstack.init(AIRSTACK_KEY);

let SYMBOLS = {
  CORRECT: '✅',
  INCORRECT: '❌',
};

  const statuses = {
    0: 'Stay cautious !!!',
    1: 'Connected',
    2: 'Strongly Connected',
  };

const SUCCESS_MESSAGES_TO_USER = {
  "TRANSFER_HISTORY_FOUND": `${SYMBOLS.CORRECT} Previous transfer history present `,
  "COMMON_FOLLOWERS":`${SYMBOLS.CORRECT} Common follower on lens and fascaster`,
  "RECEIVER_HISTORY":`${SYMBOLS.CORRECT} Receiver has transfer history `,
  "FOLLOW_EACH_OTHER":`${SYMBOLS.CORRECT} You both follow each other`,
  "RECEIVER_NON_VIRTUAL_POAP":`${SYMBOLS.CORRECT} Receiver has non virtual POAP`
}

const FAILURE_MESSAGES_TO_USER = {
  NO_TRANSFER_HISTORY_FOUND: `${SYMBOLS.INCORRECT} No previous history found `,
  NO_COMMON_FOLLOWERS: `${SYMBOLS.INCORRECT} No common followers on farcaster and lens`,
  NO_RECEIVER_HISTORY: `${SYMBOLS.INCORRECT} No transfer history with receiver`,
  NO_FOLLOW_EACH_OTHER: `${SYMBOLS.INCORRECT} You both don't follow each other on farcaster and lens`,
  NO_RECEIVER_NON_VIRTUAL_POAP: `${SYMBOLS.INCORRECT} Receiver do not have non-virtual POAP`,
};

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
  // request,
}) => {
  // TODO: perform calculation here

  console.log('perform query here');
  //     const query = `query isFollowing { # Top-level is User B's Identity (ipeciura.eth)
  //   Wallet(input: {identity: "ipeciura.eth", blockchain: ethereum}) {
  //     socialFollowings( # Here is User A's Identity (betashop.eth)
  //       input: {filter: {identity: {_in: ["betashop.eth"]}}}
  //     ) {
  //       Following {
  //         dappName
  //         dappSlug
  //         followingProfileId
  //         followerProfileId
  //         followerAddress {
  //           addresses
  //           socials {
  //             dappName
  //             profileName
  //           }
  //           domains {
  //             name
  //           }
  //         }
  //       }
  //     }
  //   }
  // }`;

  //     const { data, error } = await airstack.fetchQuery(query);

  //     console.log('data:', data);

  //     console.log('error:', error);

  const from = '';

  const driveFrom = 'betashop.eth';
  const driveTo = 'ipeciura.eth';
  // const from = 'betashop.eth';
  const to = 'ipeciura.eth';

  // const variables = {
  //   from: driveFrom,
  //   to: driveTo,
  // };

  const variables = {
    from: transaction.from,
    to: transaction.to,
  };

  const allEOADynamicQuery = `query AllEOAQuery($from: Identity!, $to: Identity!)  { # Top-level is User B's Identity (ipeciura.eth)
  hasSocialFollowing: Wallet(input: {identity: $to, blockchain: ethereum}) {
    socialFollowings( # Here is User A's Identity (betashop.eth)
      input: {filter: {identity: {_in: [$from]}}}
    ) {
      Following {
        dappName
        dappSlug
        followingProfileId
        followerProfileId
        followerAddress {
          addresses
          socials {
            dappName
            profileName
          }
          domains {
            name
          }
        }
      }
    }
  }
  
  hasEthereumTokenTransfers: TokenTransfers(
    input: {
      filter: { from: { _in: [$from] }, to: { _eq: $to } }
      blockchain: ethereum
    }
  ) {
    TokenTransfer {
      from {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      to {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      transactionHash
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  hasPolygonTokenTransfers: TokenTransfers(
    input: {
      filter: { from: { _in: [$from] }, to: { _eq: $to } }
      blockchain: polygon
    }
  ) {
    TokenTransfer {
      from {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      to {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      transactionHash
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  
  
  hasEthereumTokenbalance: TokenBalances(
    input: {
      filter: { owner: { _in: ["vitalik.eth"] } }
      blockchain: ethereum
      limit: 50
    }
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      amount
      tokenType
      token {
        name
        symbol
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  hasPolygonTokenbalance: TokenBalances(
    input: {
      filter: { owner: { _in: ["vitalik.eth"] } }
      blockchain: polygon
      limit: 50
    }
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      amount
      tokenType
      token {
        name
        symbol
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  
  hasPrimaryENS: Domains(
    input: {
      filter: {
        owner: { _in: [$to] }
        isPrimary: { _eq: true }
      }
      blockchain: ethereum
    }
  ) {
    Domain {
      name
      owner
      isPrimary
    }
  }
  
  
  hasLens: Socials(
    input: {
      filter: {
        dappName: { _eq: lens }
        identity: { _in: [$to] }
      }
      blockchain: ethereum
    }
  ) {
    Social {
      profileName
      profileTokenId
      profileTokenIdHex
    }
  }
  
  hasFarcaster: Socials(
    input: {
      filter: {
        dappName: { _eq: farcaster }
        identity: { _in: [$to] }
      }
      blockchain: ethereum
    }
  ) {
    Social {
      profileName
      userId
      userAssociatedAddresses
    }
  }
  
  
  hasPoaps: Poaps(
    input: {
      filter: { owner: { _in: [$to] } }
      blockchain: ALL
      limit: 50
    }
  ) {
    Poap {
      mintOrder
      mintHash
      poapEvent {
        isVirtualEvent
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }

  hasCommonPoaps:Poaps(
    input: {
      filter: { owner: { _eq: $from } }
      blockchain: ALL
      limit: 50
    }
  ) {
    Poap {
      poapEvent {
        poaps(input: { filter: { owner: { _eq: $to } } }) {
          eventId
          mintHash
          mintOrder
          poapEvent {
            eventName
            eventURL
            contentValue {
              image {
                extraSmall
                small
                original
                medium
                large
              }
            }
            isVirtualEvent
            city
          }
        }
      }
    }
  }

      ethereumFromTokenTransfer: TokenTransfers(
    input: { filter: { from: { _in: [$to] } }, blockchain: ethereum }
  ) {
    TokenTransfer {
      from {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      to {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      transactionHash
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  polygonFromTokenTransfer: TokenTransfers(
    input: { filter: { from: { _in: [$to] } }, blockchain: polygon }
  ) {
    TokenTransfer {
      from {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      to {
        addresses
        domains {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          profileTokenIdHex
          userId
          userAssociatedAddresses
        }
      }
      transactionHash
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
  
  hasCommonFollowersLensOrFarcaster: SocialFollowers(
    input: {
      filter: { identity: { _eq: $from } }
      blockchain: ALL
      limit: 50
    }
  ) {
    Follower {
      followerAddress {
        socialFollowers(
          input: { filter: { identity: { _eq: $to } } }
        ) {
          Follower {
            followerAddress {
              addresses
              domains {
                name
              }
              socials {
                profileName
                profileTokenId
                profileTokenIdHex
                userId
                userAssociatedAddresses
              }
            }
          }
        }
      }
    }
  }
}
  `;

  const url = 'https://api.airstack.xyz/gql';

  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: allEOADynamicQuery, variables }),
  }).then((response) => {
    return response.json();
  });

  const ethereumTokenTransfer = data.data['hasEthereumTokenTransfers'];
  const polygonTokenTransfer = data.data['hasPolygonTokenTransfers'];
  const tokenTranferConnect = checkIfAlreadyTransferHistroyBetweenFromTo(
    ethereumTokenTransfer,
    polygonTokenTransfer,
  );

  let finalStatus = statuses[0];

  let descriptions = [];
  let insightPanel = [];
  if (tokenTranferConnect) {
    finalStatus = statuses[1];
    descriptions.push(text(SUCCESS_MESSAGES_TO_USER.TRANSFER_HISTORY_FOUND));
  }

  const commonFollowerConnect = commonFollowersOnLensAndFascaster(
    data.data['hasCommonFollowersLensOrFarcaster']?.Follower,
  );

  if (commonFollowerConnect) {
    descriptions.push(text(SUCCESS_MESSAGES_TO_USER.COMMON_FOLLOWERS));

    if (finalStatus == statuses[1]) {
      finalStatus = statuses[2];
    }
  }

  const doesReceiverHasStrongTransferHistory =
    checkIfReceiverHasStronglTransferHistory(data);

  const ethereumFromTokenTransfer = data.data['ethereumFromTokenTransfer'];
  const polygonFromTokenTransfer = data.data['polygonFromTokenTransfer'];

  console.log('ethereumFromTokenTransfer ', ethereumFromTokenTransfer);
  console.log('polygonFromTokenTransfer ', polygonFromTokenTransfer);

  if (doesReceiverHasStrongTransferHistory) {
    descriptions.push(text(SUCCESS_MESSAGES_TO_USER.RECEIVER_HISTORY));
  }

  const doesBothUserStronglyFollowsEachOther =
    doesBothUserStronglyFollowEachOther(data);

  if (doesBothUserStronglyFollowsEachOther) {
    descriptions.push(text(SUCCESS_MESSAGES_TO_USER.FOLLOW_EACH_OTHER));
  }

  const isNonVirtualPoapAttended = checkIfNonVirtualPOAPAttended(
    data.data['hasPoaps']['Poap'],
  );

  if (isNonVirtualPoapAttended) {
    descriptions.push(text(SUCCESS_MESSAGES_TO_USER.RECEIVER_NON_VIRTUAL_POAP));
  }
  console.log('data returned ', JSON.stringify(data));

  insightPanel.push(heading(`Status : ${finalStatus}`));
  insightPanel.push(divider());

  for (let i = 0; i < descriptions.length; i++) {
    const description = descriptions[i];
    insightPanel.push(description);
  }

  // no connection found
  if (descriptions.length == 0) {
    insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_TRANSFER_HISTORY_FOUND))
    insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_COMMON_FOLLOWERS))
    insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_RECEIVER_HISTORY))
    insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_FOLLOW_EACH_OTHER))
    insightPanel.push(text(FAILURE_MESSAGES_TO_USER.NO_RECEIVER_NON_VIRTUAL_POAP))
  }

  return {
    content: panel(insightPanel),
    // severity: SeverityLevel.Critical,
  };
};

const checkIfAlreadyTransferHistroyBetweenFromTo = (
  ethereumTokenTransfer: any,
  polygonTokenTransfer: any,
) => {
  return ethereumTokenTransfer?.TokenTransfer?.length || polygonTokenTransfer?.TokenTransfer?.length;

}

const checkIfToAddressHasTransferHistory = (
  ethereumFromTransferHistory: any,
  polygonFromTransferHistory: any,
) => {
  return (
    ethereumFromTransferHistory?.TokenTransfer?.length ||
    polygonFromTransferHistory?.TokenTransfer?.length
  );

}

const doesBothUserFollowEachOther = (
  socialFollowing: any
) => {
  const following = socialFollowing?.Following;

  if (!following) {
    return false;
  }
  
  return following?.length > 0;
}

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

  return (
    isFromUserFollowsTo &&
    (isCommonPOAPEventsAttended ||
      doesUserHasLensProfile ||
      doesUserHasFarcasterProfile ||
      doesUserHasPrimaryENS)
  );

}

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

const checkIfReceiverHasStronglTransferHistory = (data:any) => {
  // 
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

const hasLensProfile = (lensData: any) => {
    // const socialProfile = data.data['hasLens'];

    const lensProfile = lensData['Social'];

    if (!lensProfile) {
      return false;
    }

    if (lensProfile.length > 0) {
      return true;
    }
  
  return false;
 };

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