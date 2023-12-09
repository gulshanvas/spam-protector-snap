import type { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { SeverityLevel, divider, heading, image, panel, row, text } from '@metamask/snaps-sdk';

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
  const query = `query isFollowing { # Top-level is User B's Identity (ipeciura.eth)
  Wallet(input: {identity: "ipeciura.eth", blockchain: ethereum}) {
    socialFollowings( # Here is User A's Identity (betashop.eth)
      input: {filter: {identity: {_in: ["betashop.eth"]}}}
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
}`;

  const driveFrom = 'betashop.eth';
  const driveTo = 'ipeciura.eth';
  // const from = 'betashop.eth';
  const to = 'ipeciura.eth';

  const variables = {
    from: driveFrom,
    to: driveTo,
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
        owner: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
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
        identity: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
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
        identity: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
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
      filter: { owner: { _in: ["vitalik.eth"] } }
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

  //   const allEOAQuery = `query AllEOAQuery { # Top-level is User B's Identity (ipeciura.eth)
  //   hasSocialFollowing: Wallet(input: {identity: "ipeciura.eth", blockchain: ethereum}) {
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

  //   hasEthereumTokenTransfers: TokenTransfers(
  //     input: {
  //       filter: { from: { _in: ["betashop.eth"] }, to: { _eq: "ipeciura.eth" } }
  //       blockchain: ethereum
  //     }
  //   ) {
  //     TokenTransfer {
  //       from {
  //         addresses
  //         domains {
  //           name
  //         }
  //         socials {
  //           dappName
  //           profileName
  //           profileTokenId
  //           profileTokenIdHex
  //           userId
  //           userAssociatedAddresses
  //         }
  //       }
  //       to {
  //         addresses
  //         domains {
  //           name
  //         }
  //         socials {
  //           dappName
  //           profileName
  //           profileTokenId
  //           profileTokenIdHex
  //           userId
  //           userAssociatedAddresses
  //         }
  //       }
  //       transactionHash
  //     }
  //     pageInfo {
  //       nextCursor
  //       prevCursor
  //     }
  //   }
  //   hasPolygonTokenTransfers: TokenTransfers(
  //     input: {
  //       filter: { from: { _in: ["betashop.eth"] }, to: { _eq: "ipeciura.eth" } }
  //       blockchain: polygon
  //     }
  //   ) {
  //     TokenTransfer {
  //       from {
  //         addresses
  //         domains {
  //           name
  //         }
  //         socials {
  //           dappName
  //           profileName
  //           profileTokenId
  //           profileTokenIdHex
  //           userId
  //           userAssociatedAddresses
  //         }
  //       }
  //       to {
  //         addresses
  //         domains {
  //           name
  //         }
  //         socials {
  //           dappName
  //           profileName
  //           profileTokenId
  //           profileTokenIdHex
  //           userId
  //           userAssociatedAddresses
  //         }
  //       }
  //       transactionHash
  //     }
  //     pageInfo {
  //       nextCursor
  //       prevCursor
  //     }
  //   }

  //   hasEthereumTokenbalance: TokenBalances(
  //     input: {
  //       filter: { owner: { _in: ["vitalik.eth"] } }
  //       blockchain: ethereum
  //       limit: 50
  //     }
  //   ) {
  //     TokenBalance {
  //       tokenAddress
  //       tokenId
  //       amount
  //       tokenType
  //       token {
  //         name
  //         symbol
  //       }
  //     }
  //     pageInfo {
  //       nextCursor
  //       prevCursor
  //     }
  //   }
  //   hasPolygonTokenbalance: TokenBalances(
  //     input: {
  //       filter: { owner: { _in: ["vitalik.eth"] } }
  //       blockchain: polygon
  //       limit: 50
  //     }
  //   ) {
  //     TokenBalance {
  //       tokenAddress
  //       tokenId
  //       amount
  //       tokenType
  //       token {
  //         name
  //         symbol
  //       }
  //     }
  //     pageInfo {
  //       nextCursor
  //       prevCursor
  //     }
  //   }

  //   hasPrimaryENS: Domains(
  //     input: {
  //       filter: {
  //         owner: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
  //         isPrimary: { _eq: true }
  //       }
  //       blockchain: ethereum
  //     }
  //   ) {
  //     Domain {
  //       name
  //       owner
  //       isPrimary
  //     }
  //   }

  //   hasLens: Socials(
  //     input: {
  //       filter: {
  //         dappName: { _eq: lens }
  //         identity: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
  //       }
  //       blockchain: ethereum
  //     }
  //   ) {
  //     Social {
  //       profileName
  //       profileTokenId
  //       profileTokenIdHex
  //     }
  //   }

  //   hasFarcaster: Socials(
  //     input: {
  //       filter: {
  //         dappName: { _eq: farcaster }
  //         identity: { _in: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] }
  //       }
  //       blockchain: ethereum
  //     }
  //   ) {
  //     Social {
  //       profileName
  //       userId
  //       userAssociatedAddresses
  //     }
  //   }

  //   hasPoaps: Poaps(
  //     input: {
  //       filter: { owner: { _in: ["vitalik.eth"] } }
  //       blockchain: ALL
  //       limit: 50
  //     }
  //   ) {
  //     Poap {
  //       mintOrder
  //       mintHash
  //       poapEvent {
  //         isVirtualEvent
  //       }
  //     }
  //     pageInfo {
  //       nextCursor
  //       prevCursor
  //     }
  //   }

  //   hasCommonPoaps:Poaps(
  //     input: {
  //       filter: { owner: { _eq: "betashop.eth" } }
  //       blockchain: ALL
  //       limit: 50
  //     }
  //   ) {
  //     Poap {
  //       poapEvent {
  //         poaps(input: { filter: { owner: { _eq: "ipeciura.eth" } } }) {
  //           eventId
  //           mintHash
  //           mintOrder
  //           poapEvent {
  //             eventName
  //             eventURL
  //             contentValue {
  //               image {
  //                 extraSmall
  //                 small
  //                 original
  //                 medium
  //                 large
  //               }
  //             }
  //             isVirtualEvent
  //             city
  //           }
  //         }
  //       }
  //     }
  //   }

  //   hasCommonFollowersLensOrFarcaster: SocialFollowers(
  //     input: {
  //       filter: { identity: { _eq: "betashop.eth" } }
  //       blockchain: ALL
  //       limit: 50
  //     }
  //   ) {
  //     Follower {
  //       followerAddress {
  //         socialFollowers(
  //           input: { filter: { identity: { _eq: "ipeciura.eth" } } }
  //         ) {
  //           Follower {
  //             followerAddress {
  //               addresses
  //               domains {
  //                 name
  //               }
  //               socials {
  //                 profileName
  //                 profileTokenId
  //                 profileTokenIdHex
  //                 userId
  //                 userAssociatedAddresses
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  //   `;

  // const isContract = await window.ethereum.request({ method: 'eth_getCode' });

  const url = 'https://api.airstack.xyz/gql';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-key': AIRSTACK_KEY,
    },
    body: JSON.stringify({ query: allEOADynamicQuery }),
  };
  // const request = new Request(url, options);

  // console.log("request ", request.body());
  // console.log('request ', request);

  // const data = await fetch(request).then((response) => {
  //   return response.json();
  // });
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // "x-key": AIRSTACK_KEY,
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

  let RIGHT_GREEN_SYMBOL = '✅';

  let statuses = {
    0: 'Stay cautious !!!',
    1: 'Connected',
    2: 'Strongly Connected',
  };

  let finalStatus;

  let descriptions = [];
  let insightPanel = [];
  if (tokenTranferConnect) {
    finalStatus = statuses[1];
    descriptions.push(
      text(`${RIGHT_GREEN_SYMBOL} Previous transfer histroy present `),
    );
  }

  const commonFollowerConnect = commonFollowersOnLensAndFascaster(
    data.data['hasCommonFollowersLensOrFarcaster'].Follower,
  );

  if (commonFollowerConnect) {
    descriptions.push(
      text(`${RIGHT_GREEN_SYMBOL} Common follower on lens and fascaster `),
    );

    if (finalStatus == statuses[1]) {
      finalStatus = statuses[2]
    }
  }
    // insightPanel.push(row("text something : ", text("good")));

    console.log('data returned ', JSON.stringify(data));

  const socialFollowingName =
    data.data['hasSocialFollowing'].socialFollowings.Following[0].dappName;

  insightPanel.push(heading(`Status : ${finalStatus}`));
  insightPanel.push(divider());
  
  for (let i = 0; i < descriptions.length; i++) {
   const description = descriptions[i]
    insightPanel.push(description);
  }
  return {
    content: panel(insightPanel),
    // severity: SeverityLevel.Critical,
  };

  // working
  // return {
  //   content: panel([
  //     heading(`Status : ${finalStatus}`),
  //     divider(),

      // text(`${RIGHT_GREEN_SYMBOL} You have previous transfer history`),
  //     // imageContent,
  //   ]),
  //   severity: SeverityLevel.Critical,
  // };
};

const checkIfAlreadyTransferHistroyBetweenFromTo = (
  ethereumTokenTransfer: any,
  polygonTokenTransfer: any,
) => {
  return ethereumTokenTransfer.TokenTransfer.length || polygonTokenTransfer.TokenTransfer.length;

}

const commonFollowersOnLensAndFascaster = (
  commonFollowersOnSocials: any // lens or farcaster
) => {
  let isCommonFollowerPresent = false;

    for (let i = 0; i < commonFollowersOnSocials.length; i++) {
      const followerObj = commonFollowersOnSocials[i];
      // if(isCommonFollowerPresent)
      const followerList =
        followerObj['followerAddress']['socialFollowers']['Follower'];

      if (followerList != null && followerList.length > 0) {
        console.log('followerObj ', followerObj);
        isCommonFollowerPresent = true;
        break;
      }
    }
  
  return isCommonFollowerPresent;


}

const checkIfUserStronglyFollowsOther = (data) => {
  //
}

const commonPOAPEventsAttended = () => {
  
}

const hasLensProfile = () => {};



// const checkIfNonVirtualPOAPAttended = (
//   POAPsOwnedByAddress
// ) => {

// }

// import { OnTransactionHandler } from '@metamask/snaps-types';
// import { panel, heading, text } from '@metamask/snaps-ui';

// export const onTransaction: OnTransactionHandler = async ({
//   transaction,
//   chainId,
//   transactionOrigin,
// }) => {
//   const insights = /* Get insights */;
//   return {
//     content: panel([
//       heading('My Transaction Insights'),
//       text('Here are the insights:'),
//       ...(insights.map((insight) => text(insight.value)))
//     ])
//   };
// };
