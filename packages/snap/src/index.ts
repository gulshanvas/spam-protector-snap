import type { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { SeverityLevel, divider, heading, image, panel, text } from '@metamask/snaps-sdk';

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

console.log('perform query here')
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
  
  const allEOAQuery = `query AllEOAQuery { # Top-level is User B's Identity (ipeciura.eth)
  hasSocialFollowing: Wallet(input: {identity: "ipeciura.eth", blockchain: ethereum}) {
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
  
  hasEthereumTokenTransfers: TokenTransfers(
    input: {
      filter: { from: { _in: ["betashop.eth"] }, to: { _eq: "ipeciura.eth" } }
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
      filter: { from: { _in: ["betashop.eth"] }, to: { _eq: "ipeciura.eth" } }
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
      filter: { owner: { _eq: "betashop.eth" } }
      blockchain: ALL
      limit: 50
    }
  ) {
    Poap {
      poapEvent {
        poaps(input: { filter: { owner: { _eq: "ipeciura.eth" } } }) {
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
      filter: { identity: { _eq: "betashop.eth" } }
      blockchain: ALL
      limit: 50
    }
  ) {
    Follower {
      followerAddress {
        socialFollowers(
          input: { filter: { identity: { _eq: "ipeciura.eth" } } }
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
  
  // const isContract = await window.ethereum.request({ method: 'eth_getCode' });

    const url = 'https://api.airstack.xyz/gql';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': AIRSTACK_KEY, // replace with your RapidAPI key
      },
      body: JSON.stringify({ query: allEOAQuery }),
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
      // "x-key": AIRSTACK_KEY, // replace with your RapidAPI key
    },
    body: JSON.stringify({ query: allEOAQuery }),
  }).then((response) => {
    return response.json();
  });
  
  
  console.log('data returend ', JSON.stringify(data));
  const imageContent = image(
    '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.514 17.874 9 5c.021.011.043.016.064.026s.051.021.078.031a.892.892 0 0 0 .688 0c.027-.01.052-.019.078-.031s.043-.015.064-.026l9-5A1 1 0 0 0 22 16.9L21 7V2a1 1 0 0 0-1.625-.781L14.649 5h-5.3L4.625 1.219A1 1 0 0 0 3 2v4.9l-1 10a1 1 0 0 0 .514.974ZM5 7V4.081l3.375 2.7A1 1 0 0 0 9 7h6a1 1 0 0 0 .625-.219L19 4.079V7.1l.934 9.345L13 20.3v-2.967l1.42-.946A1.3 1.3 0 0 0 15 15.3a1.3 1.3 0 0 0-1.3-1.3h-3.4A1.3 1.3 0 0 0 9 15.3a1.3 1.3 0 0 0 .58 1.084l1.42.946v2.97l-6.94-3.855Zm3.5 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm5-2a2 2 0 1 1 2 2 2 2 0 0 1-2-2Z"/></svg>',
  );

  const socialFollowingName = data.data['hasSocialFollowing'].socialFollowings.Following[0].dappName;
// working
// data.data.Wallet.socialFollowings.Following[0].dappName;
  return {
    content: panel([
      heading(`Gulshan test ${socialFollowingName}`),
      divider(),
      text('**this seems to be great 👤 **'),
      // imageContent,
    ]),
    severity: SeverityLevel.Critical,
  };
};

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
