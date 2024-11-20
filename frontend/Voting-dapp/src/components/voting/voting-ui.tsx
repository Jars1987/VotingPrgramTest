'use client';

import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
// import { useMemo } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useVotingProgram,
  useVotingProgramAccount,
} from './voting-data-access';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { BN } from 'bn.js';

export function PollCreate() {
  // Function to get today's date at midnight
  const getTodayTimestamp = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sets time to 00:00:00
    return today.getTime();
  };

  // Helper function to format timestamp to 'YYYY-MM-DD'
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  const { initializePoll, pollAccounts } = useVotingProgram();
  const { publicKey } = useWallet();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [poll_start, setPollStart] = useState(getTodayTimestamp());
  const [poll_end, setPollEnd] = useState(getTodayTimestamp());

  // 0- Constraints on the name and description length
  // 1- const totalPollAmount = fetch the total poll acccounts and check lenght
  // 2- get unix timestampp converter so we convert the date to unix timestamp when pass the arguments to initializePoll (plus new Anchor BN(value))

  // poll_id, name, description, poll_start, poll_end
  const isFormValid = name.trim() !== '' && description.trim() !== '';

  const handleSubmit = () => {
    const totalPollAccounts = pollAccounts.data?.length || 0;
    const poll_start_date = new anchor.BN(poll_start);
    const poll_end_date = new anchor.BN(poll_end);
    const pollId = new anchor.BN(totalPollAccounts + 1);

    console.log('Poll Accounts:', pollAccounts);

    if (publicKey && isFormValid) {
      initializePoll.mutateAsync({
        poll_id: pollId,
        name,
        description,
        poll_start: poll_start_date,
        poll_end: poll_end_date,
      });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return (
    <div className='space-y-4'>
      <input
        type='text'
        placeholder='Poll Name'
        value={name}
        onChange={e => setName(e.target.value.slice(0, 64))}
        maxLength={64}
        className='input input-bordered w-full'
      />
      <textarea
        placeholder='Poll Description'
        value={description}
        onChange={e => setDescription(e.target.value.slice(0, 280))}
        maxLength={280}
        className='textarea textarea-bordered w-full'
      />
      <div className='flex space-x-4'>
        <input
          type='date'
          placeholder='Poll Start'
          value={formatDate(poll_start)}
          onChange={e => setPollStart(new Date(e.target.value).getTime())}
          className='input input-bordered w-full max-w-xs'
        />
        <input
          type='date'
          placeholder='Poll End'
          value={formatDate(poll_end)}
          onChange={e => setPollEnd(new Date(e.target.value).getTime())}
          className='input input-bordered w-full max-w-xs'
        />
      </div>
      <button
        className='btn btn-primary w-full'
        onClick={handleSubmit}
        disabled={initializePoll.isPending || !isFormValid}
      >
        Create Poll {initializePoll.isPending && '...'}
      </button>
    </div>
  );
}

export function PollList() {
  const { pollAccounts, getProgramAccount } = useVotingProgram();

  const totalPollIds = pollAccounts.data?.map(account =>
    account.account.pollId.toNumber()
  );

  console.log('Poll Accounts Ids:', totalPollIds);

  //filter the poll accounts by the current user
  const { publicKey } = useWallet();

  const ownedPolls = pollAccounts.data?.filter(
    account => account.account.pollOwner.toBase58() === publicKey?.toBase58()
  );

  if (getProgramAccount.isLoading) {
    return <span className='loading loading-spinner loading-lg'></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className='flex justify-center alert alert-info'>
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {pollAccounts.isLoading ? (
        <span className='loading loading-spinner loading-lg'></span>
      ) : pollAccounts.data?.length ? (
        <div className='flex flex-col items-center space-y-4'>
          {ownedPolls?.map(account => (
            <PollCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className='text-center'>
          <h2 className={'text-2xl'}>No accounts</h2>
          No Polls found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function PollCard({ account }: { account: PublicKey }) {
  const { pollAccountQuery, initializeCandidate, candidateAccounts, vote } =
    useVotingProgramAccount({
      account,
    });

  const { publicKey } = useWallet();
  const [candidateName, setCandidateName] = useState('');

  const pollCandidatesList = candidateAccounts.data?.filter(
    (candidate: any) =>
      candidate.account.poll.toNumber() ===
      pollAccountQuery.data?.pollId.toNumber()
  );

  const totalCandidates = pollCandidatesList?.length || 0;
  const isFormValid = candidateName.trim() !== '';

  //--------------- DEBUGGING -------------------
  const candidatesList = pollCandidatesList?.map(candidate => {
    candidate.account.candidateName;
  });
  console.log('Candidate Accounts', candidateAccounts.data);
  console.log('Candidates:', candidatesList);

  //--------------- xxxxxxxxx -------------------

  const handleSubmit = () => {
    const pollId = pollAccountQuery.data?.pollId;
    if (publicKey && isFormValid && pollId) {
      initializeCandidate.mutateAsync({
        candidate_name: candidateName,
        poll_id: pollId,
      });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return pollAccountQuery.isLoading ? (
    <span className='loading loading-spinner loading-lg'></span>
  ) : (
    <div className='card card-bordered border-b-fuchsia-800 border-6'>
      <div className='card-body items-center text-center'>
        <div className='space-y-6'>
          <h2
            className='card-name justify-center text-3xl cursor-pointer font-bold'
            onClick={() => pollAccountQuery.refetch()}
          >
            {pollAccountQuery.data?.pollName}
          </h2>
          <p className='italic'>Q: {pollAccountQuery.data?.pollDescription}</p>
          <div className='card-actions'>
            {totalCandidates < 10 ? (
              <>
                <h3 className='text-center w-full'>
                  Want to add a new Candidate?
                </h3>
                <div className='flex justify-center items-center space-x-4 w-full'>
                  <input
                    type='text'
                    placeholder='Candidate Name'
                    value={candidateName}
                    onChange={e =>
                      setCandidateName(e.target.value.slice(0, 32))
                    }
                    maxLength={32}
                    className='input input-bordered w-full max-w-xs text-center'
                  />
                  <button
                    className='btn btn-xs lg:btn-md btn-primary'
                    onClick={handleSubmit}
                    disabled={initializeCandidate.isPending || !isFormValid}
                  >
                    Submit Candidate {initializeCandidate.isPending && '...'}
                  </button>
                </div>
              </>
            ) : (
              <h3>Maximum number of candidates reached</h3>
            )}
          </div>
          <div className='text-center space-y-4'>
            {totalCandidates ? (
              <>
                <h3>Current Candidates:</h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  {pollCandidatesList?.map(candidate => (
                    <div
                      key={candidate.publicKey.toString()}
                      className='card card-body card-bordered bg-stone-300 border-purple-800 text-black'
                    >
                      <h4>{candidate.account.candidateName}</h4>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <h5 className='text-xs'>
                No Candidates have been add to the poll yet.
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
