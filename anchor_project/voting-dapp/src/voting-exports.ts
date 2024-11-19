// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import VotingDappIDL from '../target/idl/voting_dapp.json';
import type { VotingDapp } from '../target/types/voting_dapp.ts';

// Re-export the generated IDL and type
export { VotingDapp, VotingDappIDL };

// The programId is imported from the program IDL.
export const VOTING_PROGRAM_ID = new PublicKey(VotingDappIDL.address);

// This is a helper function to get the Journal Anchor program.
export function getVotingProgram(provider: AnchorProvider) {
  return new Program(VotingDappIDL as VotingDapp, provider);
}

// This is a helper function to get the program ID for the Journal program depending on the cluster.
export function getVotingProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Journal program on devnet and testnet.
      return new PublicKey('JDMKvhV3gafANaWaLjsUTrevDbG7kXNUm6R9UgzP1ixy');
    case 'mainnet-beta':
    default:
      return VOTING_PROGRAM_ID;
  }
}
