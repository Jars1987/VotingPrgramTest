'use client';

import Link from 'next/link';
import { AppHero } from '../ui/ui-layout';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';

export default function DashboardFeature() {
  const { publicKey } = useWallet();

  return (
    <div>
      <AppHero title='SolKratus' subtitle='Your sol, your vote your rule!' />

      <div className='max-w-xl mx-auto py-2 sm:px-6 lg:px-2 text-center'>
        <div className='space-y-2'>
          <p className='italic'>
            Start now by creating your own pool or vote on an existing poll.
          </p>
          <div>
            {publicKey ? (
              <Link href='/voting'>
                <button className='btn btn-primary mt-6'>Create Poll</button>
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
        </div>
      </div>
    </div>
  );
}