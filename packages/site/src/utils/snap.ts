import type { MetaMaskInpageProvider } from '@metamask/providers';

import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  // await window.ethereum.request({
  //   method: 'wallet_invokeSnap',
  //   params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  // });

  // const wallet = await window.

  const connectedAccount = await window.ethereum.request({
    method: 'eth_requestAccounts',
  })

  console.log('connectedAccount ', connectedAccount);

const data = "0x"
  if (connectedAccount) {
    const wallet = connectedAccount as [];

    /**
     * Uniswap V2 router contract : 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
     */
    if (wallet.length > 0) {
      console.log('wallet ', wallet.at(0));
      const account = wallet.at(0);
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            value: '0x0',
            data,
          },
        ],
      });
    }
  }


};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
