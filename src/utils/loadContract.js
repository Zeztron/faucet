import contract from '@truffle/contract';

export const loadContract = async (contractName, provider) => {
  const response = await fetch(`/contracts/${contractName}.json`);
  const artifact = await response.json();

  const _contract = contract(artifact);
  _contract.setProvider(provider);

  const deployedContract = await _contract.deployed();

  return deployedContract;
};
