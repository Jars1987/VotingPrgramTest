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
  const { initializePoll, pollAccounts } = useVotingProgram();
  const { publicKey } = useWallet();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [poll_start, setPollStart] = useState(0);
  const [poll_end, setPollEnd] = useState(0);

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
    <div>
      <input
        type='text'
        placeholder='Poll Name'
        value={name}
        onChange={e => setName(e.target.value.slice(0, 64))}
        maxLength={64}
        className='input input-bordered w-full max-w-xs'
      />
      <textarea
        placeholder='Poll Description'
        value={description}
        onChange={e => setDescription(e.target.value.slice(0, 280))}
        maxLength={280}
        className='textarea textarea-bordered w-full max-w-xs'
      />
      <input
        type='date'
        placeholder='Poll Start'
        value={new Date(poll_start).toISOString().split('T')[0]} // Display in YYYY-MM-DD format
        onChange={e => setPollStart(new Date(e.target.value).getTime())}
        className='input input-bordered w-full max-w-xs'
      />
      <input
        type='date'
        placeholder='Poll End'
        value={new Date(poll_end).toISOString().split('T')[0]} // Display in YYYY-MM-DD format
        onChange={e => setPollEnd(new Date(e.target.value).getTime())}
        className='input input-bordered w-full max-w-xs'
      />
      <br></br>
      <button
        className='btn btn-xs lg:btn-md btn-primary'
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
        <div className='grid gap-4 md:grid-cols-2'>
          {pollAccounts.data?.map(account => (
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
  const name = pollAccountQuery.data?.pollName;
  const description = pollAccountQuery.data?.pollDescription;
  const pollId = pollAccountQuery.data?.pollId;
  const totalCandidates = candidateAccounts.data?.length || 0;
  const isFormValid = candidateName.trim() !== '';

  //--------------- DEBUGGING -------------------
  const candidatesList = candidateAccounts.data?.map(candidate => {
    candidate.account.candidateName;
  });
  console.log('Candidates:', candidatesList);

  //--------------- xxxxxxxxx -------------------

  const handleSubmit = () => {
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
    <div className='card card-bordered border-base-300 border-4 text-neutral-content'>
      <div className='card-body items-center text-center'>
        <div className='space-y-6'>
          <h2
            className='card-name justify-center text-3xl cursor-pointer'
            onClick={() => pollAccountQuery.refetch()}
          >
            {pollAccountQuery.data?.pollName}
          </h2>
          <p>{pollAccountQuery.data?.pollDescription}</p>
          <div className='card-actions justify-around'>
            {totalCandidates < 10 ? (
              <>
                <h3>Want to add a new Candidate?</h3>
                <input
                  type='text'
                  placeholder='Candidate Name'
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value.slice(0, 32))}
                  maxLength={32}
                  className='input input-bordered w-full max-w-xs'
                />
                <button
                  className='btn btn-xs lg:btn-md btn-primary'
                  onClick={handleSubmit}
                  disabled={initializeCandidate.isPending || !isFormValid}
                >
                  Update Journal Entry {initializeCandidate.isPending && '...'}
                </button>
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
                  {candidateAccounts.data?.map(candidate => (
                    <div
                      key={candidate.publicKey.toString()}
                      className='card card-body bg-base-200'
                    >
                      <h4>{candidate.account.candidateName}</h4>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <h3>No Candidates have been add to the poll yet.</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
