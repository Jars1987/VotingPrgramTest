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

  const isFormValid = name.trim() !== '' && description.trim() !== '';

  const handleSubmit = () => {
    const totalPollAccounts = pollAccounts.data?.length || 0;
    const poll_start_date = new anchor.BN(poll_start);
    const poll_end_date = new anchor.BN(poll_end);
    const pollId = new anchor.BN(totalPollAccounts + 1);

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
      ) : ownedPolls?.length ? (
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

export function VotingList() {
  const { pollAccounts, getProgramAccount } = useVotingProgram();
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
      {!publicKey ? (
        <p className='text-center text-pink-500'>
          To vote you will need to connect your wallet
        </p>
      ) : null}
      {pollAccounts.isLoading ? (
        <span className='loading loading-spinner loading-lg'></span>
      ) : pollAccounts.data?.length ? (
        <>
          <h1 className='text-5xl text-center font-serif mt-40'>Poll List</h1>
          <div className='flex flex-col items-center space-y-4'>
            {/* Table Headers */}
            <div className='flex justify-around font-bold text-lg bg-gray-200 p-4'>
              <div className=''>Poll</div>
              <div className=''>Candidates</div>
              <div className=''>Winner</div>
            </div>
            {pollAccounts.data?.map(account => (
              <VotingCard
                key={account.publicKey.toString()}
                account={account.publicKey}
              />
            ))}
          </div>
        </>
      ) : (
        <div className='text-center'>
          No Polls found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

export function VotingCard({ account }: { account: PublicKey }) {
  const { pollAccountQuery, candidateAccounts, vote } = useVotingProgramAccount(
    {
      account,
    }
  );

  const { publicKey } = useWallet();

  const pollCandidatesList = candidateAccounts.data?.filter(
    (candidate: any) =>
      candidate.account.poll.toNumber() ===
      pollAccountQuery.data?.pollId.toNumber()
  );

  const getPollWinners = (
    pollCandidatesList: typeof candidateAccounts.data
  ) => {
    if (!pollCandidatesList || pollCandidatesList.length === 0) {
      return 'No candidates found';
    }
    const maxVotes = Math.max(
      ...pollCandidatesList.map(candidate =>
        candidate.account.candidateVotes.toNumber()
      )
    );

    const winners = pollCandidatesList.filter(
      candidate => candidate.account.candidateVotes.toNumber() === maxVotes
    );
    const winnerNames = winners.map(winner => winner.account.candidateName);

    if (winnerNames.length > 1) {
      return `It's a draw between: ${winnerNames.join(', ')}`;
    } else {
      return `Winner: ${winnerNames[0]}`;
    }
  };

  let pollSart = pollAccountQuery.data?.pollStart.toNumber() || 0;
  let pollEnd = pollAccountQuery.data?.pollEnd.toNumber() || 0;
  let hasPollEnded = pollEnd === 0 || pollEnd < Date.now() ? true : false;

  const pollStatus = () => {
    if (hasPollEnded) {
      return <p className='text-red-600'>Poll Ended</p>;
    } else if (pollSart > Date.now()) {
      return <p className='text-yellow-400'>Poll Has Not Started</p>;
    } else {
      return <p className='text-green-600'>Poll Ongoing</p>;
    }
  };

  const ownPoll =
    publicKey?.toBase58() === pollAccountQuery.data?.pollOwner.toBase58();

  const handleSubmit = (candidateName: string) => {
    const pollId = pollAccountQuery.data?.pollId;
    console.log('Poll ID:', pollId);
    console.log('Poll Id number:', pollId?.toNumber());

    if (publicKey && pollId) {
      vote.mutateAsync({
        poll_id: pollId,
        candidate_name: candidateName,
      });
    }
  };

  return (
    <div className='space-y-4'>
      {/* Poll Row */}
      <div className='flex items-start p-4 bg-white shadow-md border rounded-lg'>
        {/* Poll Section */}
        <div className='flex space-y-2'>
          <div>
            <h3 className='text-xl font-semibold mb-3'>
              {pollAccountQuery.data?.pollName}
            </h3>
            <p className='text-gray-800'>
              {pollAccountQuery.data?.pollDescription}
            </p>
            <p>Poll Start: {pollAccountQuery.data?.pollStart.toNumber()}</p>
            <p>Poll End: {pollAccountQuery.data?.pollEnd.toNumber()}</p>
          </div>

          <p className='mx-4'>{pollStatus()}</p>
        </div>

        {/* Candidates Section */}
        <div className='flex-1 space-y-2'>
          {pollCandidatesList?.map(candidate => (
            <div key={candidate.publicKey.toString()}>
              {!hasPollEnded ? (
                <button
                  className='btn btn-primary m-2'
                  onClick={() => handleSubmit(candidate.account.candidateName)}
                  disabled={ownPoll || !publicKey}
                >
                  {candidate.account.candidateName}
                </button>
              ) : (
                <p className='bg-zinc-500 rounded-md text-center'>
                  {candidate.account.candidateName}
                </p>
              )}

              <span>{candidate.account.candidateVotes.toNumber()} votes</span>
              {ownPoll && (
                <p className='text-red-500 mt-2'>
                  You cannot vote on your own poll.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Winner Section */}
        <div className='flex-1 text-center'>
          <div>{getPollWinners(pollCandidatesList)}</div>
        </div>
      </div>
    </div>
  );
}
