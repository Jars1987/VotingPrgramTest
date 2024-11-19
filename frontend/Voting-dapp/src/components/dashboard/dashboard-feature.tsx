'use client';

import Link from 'next/link';
import { AppHero } from '../ui/ui-layout';

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title='SolKratus' subtitle='Your sol, your vote your rule!' />
      <div className='max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center'>
        <div className='space-y-2'>
          <p>
            Start now by creating your own pool or vote on an existing poll.
          </p>
          <div>
            <Link href='/voting'>
              <button className='btn btn-primary mt-6'>Create Pooll</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
