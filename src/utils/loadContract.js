import contract from '@truffle/contract';

export const loadContract = async (contractName) => {
  const response = await fetch(`/contracts/${contractName}.json`);
  const artifact = await response.json();

  return contract(artifact);
};
