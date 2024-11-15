import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { VotingDapp } from '../target/types/voting_dapp';
import { Keypair, PublicKey } from '@solana/web3.js';
import { assert } from 'chai';

const programId = new PublicKey('AYR8P7KgHZNvV1RT2DBNuJDUVzF9i8dGVYJ65LviggvH');

describe('Voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const signer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.VotingDapp as Program<VotingDapp>;

  //Happy test Initialize Poll
  it('Initialize Poll', async () => {
    await program.methods
      .initializePoll(
        new anchor.BN(1),
        'Will Solana reach $500 before the new year?',
        new anchor.BN(0),
        new anchor.BN(1735689599)
      )
      .rpc();

    //Get the address of the poll
    const [pollAdress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      programId
    );

    //Fetch the poll
    const poll = await program.account.poll.fetch(pollAdress);
    console.log(poll);

    //Test if the poll id is 1
    assert.strictEqual(poll.pollId.toString(), new anchor.BN(1).toString());
  });

  //Unhappy test Initialize Poll
  it('Attempt to Initialize Poll with incorrect parameters', async () => {
    try {
      await program.methods
        .initializePoll(
          new anchor.BN(1),
          'Will Solana reach $500 before the new year?',
          new anchor.BN(1735689599),
          new anchor.BN(1731687319)
        )
        .rpc();

      // If no error is thrown, fail the test
      assert.fail(
        'Poll initialization should have failed due to invalid time range'
      );
    } catch (e) {
      // Log the full error for debugging
      console.log('Error details:', e);

      // Assert the error message contains the expected string
      assert.include(
        e.message,
        'Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0.',
        'Error message does not match expected value'
      );
      console.log(
        'Test passed: Unable to initialize poll due to invalid parameters'
      );
    }
  });

  //More tests to come
});
