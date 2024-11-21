import { useWallet } from '@solana/wallet-adapter-react';
import { VotingList } from '../voting/voting-ui';

export default function ListFeature() {
  return (
    <div className='w-full'>
      <VotingList />
    </div>
  );
}
