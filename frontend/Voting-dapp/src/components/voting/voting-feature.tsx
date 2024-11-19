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
      <AppHero title='Your Created Polls' subtitle={'Create a new poll:'}>
        <PollCreate />
      </AppHero>
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
