'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useVotingProgram } from './voting-data-access';
import { PollCreate, PollList } from './voting-ui';

export default function VotingFeature() {
  const { publicKey } = useWallet();
  const { programId } = useVotingProgram();

  return publicKey ? (
    <div>
      <AppHero title='Dashboard' subtitle={'Create a new poll:'}>
        <PollCreate />
      </AppHero>
      <h2 className='text-center text-4xl font-bold'>Your Polls List</h2>
      <h4 className='text-center italic'>
        Add candidates to the poll. Limit of 10 per poll.
      </h4>
      <PollList />
    </div>
  ) : (
    <div className='max-w-4xl mx-auto'>
      <div className='hero py-[64px]'>
        <div className='hero-content text-center'>
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
