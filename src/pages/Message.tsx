import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

import {
  conditions,
  decrypt,
  domains,
  encrypt,
  fromBytes,
  getPorterUri,
  initialize,
} from '@nucypher/taco';
import { ethers } from 'ethers';
import { hexlify } from 'ethers/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

function Message() {
  const [isInit, setIsInit] = useState(false);
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>('');
  const [ritualId, setRitualId] = useState<number | string>('');
  const [conditionParameters, setConditionParameters] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // Added message state

  const initNucypher = async () => {
    await initialize();
    setIsInit(true);
  };

  const loadWeb3Provider = async () => {
    if (!window.ethereum) {
      console.error('You need to connect to your wallet first');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    const { chainId } = await provider.getNetwork();
    const mumbaiChainId = 80001;
    if (chainId !== mumbaiChainId) {
      // Switch to Polygon Mumbai testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexlify(mumbaiChainId) }],
      });
    }

    await provider.send('eth_requestAccounts', []);
    setProvider(provider);
  };

  useEffect(() => {
    initNucypher();
    loadWeb3Provider();
  }, []);

  const handleRitualIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRitualId(event.target.value);
  };

  const handleConditionParametersChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setConditionParameters(event.target.value);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const runExample = async (event: FormEvent) => {
    event.preventDefault();

    if (!window.ethereum) {
      console.error('You need to connect to your wallet first');
    }

    await initialize();
    const domain = domains.TESTNET;

    const provider = new ethers.providers.Web3Provider(window.ethereum!, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    console.log('Encrypting message...');
    const hasPositiveBalance = new conditions.RpcCondition({
      conditionType: 'rpc', // Add the conditionType property
      chain: 80001,
      method: 'eth_getBalance',
      parameters: [':userAddress', 'latest'],
      returnValueTest: {
        comparator: '>',
        value: 0,
      },
    });

    const messageKit = await encrypt(
      provider,
      domain,
      message,
      hasPositiveBalance,
      ritualId as number,
      signer,
    );

    console.log('Decrypting message...');
    const decryptedMessage = await decrypt(
      provider,
      domain,
      messageKit,
      getPorterUri(domain),
      signer,
    );

    setDecryptedMessage(fromBytes(decryptedMessage));
  };

  return (
    <div>
      <h1>Secret message: {message}</h1>
      {decryptedMessage && <h1>Decrypted message: {decryptedMessage}</h1>}
      <form onSubmit={runExample}>
        <label>
          Ritual ID:
          <input
            type="number"
            value={ritualId}
            onChange={handleRitualIdChange}
          />
        </label>
        <br />
        <label>
          Condition Parameters:
          <input
            type="text"
            value={conditionParameters}
            onChange={handleConditionParametersChange}
          />
        </label>
        <br />
        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Message;
