'use client';

import Link from 'next/link';
import { AppHero } from '../ui/ui-layout';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { VotingList } from '../voting/voting-ui';

export default function DashboardFeature() {
  const { publicKey } = useWallet();

  return (
    <div className='w-full'>
      <div>
        <AppHero title='SolKratus' subtitle='Your sol, your vote your rule!' />

        <div className='py-2 sm:px-6 lg:px-2 text-center'>
          <div>
            <p className='italic text-lg'>
              Start now by creating your own pool or vote on an existing poll.
            </p>
            <div>
              {publicKey ? (
                <Link href='/create'>
                  <button className='btn btn-primary bg-violet-600 text-white border-violet-700 mt-6'>
                    Create Poll
                  </button>
                </Link>
              ) : (
                <div className='max-w-4xl mx-auto'>
                  <div className='hero py-[64px]'>
                    <div className='hero-content text-center'>
                      <WalletButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href={'/list'}>
              <p className='italic text-sm m-4 underline'>Vote on a Poll</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
