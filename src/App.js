import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';

const App = () => {
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider =
        window.ethereum ||
        window.web3 ||
        new Web3.providers.HttpProvider('http://localhost:7545');

      if (window.ethereum) {
        try {
          await provider.enable();
        } catch {
          console.error('User denied accounts access!');
        }
      }

      // if (window.ethereum) {
      //   provider = window.ethereum;
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // }

      setWeb3Api({
        web3: new Web3(provider),
        provider,
      });
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

  console.log(account);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account: </strong>
          </span>
          <h1>{account ? account : 'Not Connected'}</h1>
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>

          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </>
  );
};

export default App;
