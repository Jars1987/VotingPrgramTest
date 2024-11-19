'use client';

import {
  getVotingProgram,
  getVotingProgramId,
  VotingDappIDL,
  VotingDapp,
} from '../../../../../anchor_project/voting-dapp/src/voting-exports';
import { BN, Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { useMemo } from 'react';

//------------------ LETS UPDATE THE VOTING PROGRAM STUFF ------------------//

interface InitPollArgs {
  poll_id: BN;
  name: string;
  description: string;
  poll_start: BN;
  poll_end: BN;
}

interface InitCandidateArgs {
  candidate_name: string;
  poll_id: BN;
}

interface VoteArgs {
  poll_id: BN;
  candidate_name: string;
}

export function useVotingProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getVotingProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getVotingProgram(provider);

  const pollAccounts = useQuery({
    queryKey: ['poll', 'all', { cluster }],
    queryFn: () => program.account.poll.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  //Create Entries needs to be in the Program function because it's where we initiate our account
  //to be able to Edit Entries we use the Program Accounts function as the account as already been created
  const initializePoll = useMutation<string, Error, InitPollArgs>({
    mutationKey: [`initializePoll`, `create`, { cluster }],
    mutationFn: async ({
      poll_id,
      name,
      description,
      poll_start,
      poll_end,
    }) => {
      return program.methods
        .initializePoll(poll_id, name, description, poll_start, poll_end)
        .rpc();
    },
    onSuccess: signature => {
      transactionToast(signature);
      pollAccounts.refetch();
    },
    onError: error => {
      toast.error(`Error creating entry: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    pollAccounts,
    getProgramAccount,
    initializePoll,
  };
}

export function useVotingProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, pollAccounts } = useVotingProgram();

  const pollAccountQuery = useQuery({
    queryKey: ['poll', 'fetch', { cluster, account }],
    queryFn: () => program.account.poll.fetch(account),
  });

  // TRY TO GET CANDIDATES BY POLL ACCOUNT
  const candidateAccounts = useQuery({
    queryKey: ['candidate', 'all', { cluster }],
    queryFn: async () => {
      const allCandidates = await program.account.candidate.all();
      return allCandidates.filter(
        (candidate: any) => candidate.account.poll === account
      );
    },
  });

  const initializeCandidate = useMutation<string, Error, InitCandidateArgs>({
    mutationKey: [`initializeCandidate`, `create`, { cluster }],
    mutationFn: async ({ candidate_name, poll_id }) => {
      return program.methods.initializeCandidate(candidate_name, poll_id).rpc();
    },
    onSuccess: signature => {
      transactionToast(signature);
      candidateAccounts.refetch();
      pollAccountQuery.refetch();
    },
    onError: error => {
      toast.error(`Error creating entry: ${error.message}`);
    },
  });

  const vote = useMutation<string, Error, VoteArgs>({
    mutationKey: [`vote`, `create`, { cluster }],

    mutationFn: async ({ poll_id, candidate_name }) => {
      return program.methods.vote(poll_id, candidate_name).rpc();
    },
    onSuccess: signature => {
      transactionToast(signature);
      candidateAccounts.refetch();
      pollAccountQuery.refetch();
    },
    onError: error => {
      toast.error(`Error creating entry: ${error.message}`);
    },
  });

  return {
    pollAccountQuery,
    candidateAccounts,
    initializeCandidate,
    vote,
  };
}
