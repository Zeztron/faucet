import React, { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import { loadContract } from './utils/loadContract';

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadUI = useCallback(() => setReload(!reload), [reload]);

  const setAccountListener = (provider) => {
    provider.on('accountsChanged', (accounts) => setAccount(accounts[0]));
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('Faucet', provider);

      if (provider) {
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error('Please, install Metamask.');
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  const connectMetamask = () =>
    web3Api.provider.request({ method: 'eth_requestAccounts' });

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether'),
    });

    reloadUI();
  }, [web3Api, account, reloadUI]);

  const withdrawFunds = async () => {
    const { contract, web3 } = web3Api;
    await contract.withdraw(web3.utils.toWei('0.1', 'ether'), {
      from: account,
    });

    reloadUI();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>

            {account ? (
              <span>{account}</span>
            ) : (
              <button onClick={connectMetamask} className="button">
                Connect Metamask
              </button>
            )}
          </div>
          <div className="balance-view is-size-2 my-5">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button
            disabled={!account}
            onClick={addFunds}
            className="button is-link mr-2"
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!account}
            onClick={withdrawFunds}
            className="button is-primary"
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
