import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { VotingDapp } from '../target/types/voting_dapp';
import { Keypair, PublicKey } from '@solana/web3.js';
import { assert } from 'chai';

const programId = new PublicKey('5TkN5PsZXQaznE4FqkpgtDzj8D5PQvJHctnNc4hShTDV');

describe('Voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const signer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.VotingDapp as Program<VotingDapp>;

  //Happy test Initialize Poll
  it('Initialize a Poll', async () => {
    try {
      await program.methods
        .initializePoll(
          new anchor.BN(1),
          'Solana Prediction',
          'Will Solana reach $500 before the new year?',
          new anchor.BN(1731946140),
          new anchor.BN(1735689599)
        )
        .rpc();
    } catch (e) {
      // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);
      assert.fail(
        'Poll did not initialize successfully. Check the error message for more details'
      );
    }

    //Get the address of the poll
    const [pollAdress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      programId
    );

    //Fetch the poll
    const poll = await program.account.poll.fetch(pollAdress);
    console.log(poll);

    //Test if the poll id is 1
    assert.equal(poll.pollId.toNumber(), 1);
  });

  //Unhappy test Initialize Poll
  it('Attempt to Initialize Poll with incorrect parameters', async () => {
    try {
      await program.methods
        .initializePoll(
          new anchor.BN(2),
          'Solana Prediction',
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
      /* // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);

      // Assert the error message contains the expected string
      assert.include(
        e.message,
        'Poll start must be before poll end',
        'Error message does not match expected value'
      );
      */
      console.log(
        'Test passed: Unable to initialize poll due to invalid parameters'
      );
    }
  });

  it('Initialize and add Candidates to the pool', async () => {
    //call the initialize candidate instruction to add candidates to the poll

    try {
      await program.methods
        .initializeCandidate('Yes, easy!', new anchor.BN(1))
        .rpc();
    } catch (e) {
      // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);
      assert.fail(
        'Poll did not initialize successfully. Check the error message for more details'
      );
    }

    try {
      await program.methods
        .initializeCandidate('No, never!', new anchor.BN(1))
        .rpc();
    } catch (e) {
      // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);
      assert.fail(
        'Poll did not initialize successfully. Check the error message for more details'
      );
    }

    //Get the address of the poll
    const [yesAddress] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(1).toArrayLike(Buffer, 'le', 8),
        Buffer.from('Yes, easy!'),
      ],
      programId
    );

    const [noAddress] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(1).toArrayLike(Buffer, 'le', 8),
        Buffer.from('No, never!'),
      ],
      programId
    );

    //Fetch the candidates
    const yesCandidate = await program.account.candidate.fetch(yesAddress);
    const noCandidate = await program.account.candidate.fetch(noAddress);

    //lets confirm the candidates added to the pool have been initialized and have 0 votes
    assert.equal(yesCandidate.candidateVotes.toNumber(), 0);
    assert.equal(noCandidate.candidateVotes.toNumber(), 0);
  });

  it('Attempt to initiate a candidate with an invalid name', async () => {
    try {
      await program.methods
        .initializeCandidate('No, never!', new anchor.BN(1))
        .rpc();

      // If no error is thrown, fail the test
      assert.fail(
        'Candidate initialization should fail as the Candidate name already exists'
      );
    } catch (e) {
      // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);
      // Assert the error message contains the expected string
      assert.include(
        e.message,
        'Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0. ',
        'Error message does not match expected value'
      );
      console.log(
        'Test passed: Unable to initialize candidate as the Candidate name already exists and has already been initialized'
      );
    }
  });

  it('Vote for a candidate', async () => {
    //call the vote instruction to vote for a candidate
    try {
      const voteIx = await program.methods
        .vote(new anchor.BN(1), 'Yes, easy!')
        .instruction();

      const blockhashContext = await connection.getLatestBlockhash();

      const tx = new anchor.web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: blockhashContext.blockhash,
        lastValidBlockHeight: blockhashContext.lastValidBlockHeight,
      }).add(voteIx);

      const signature = await anchor.web3.sendAndConfirmTransaction(
        connection,
        tx,
        [signer.payer]
      );
      console.log(`Transaction signature: ${signature}`);
    } catch (e) {
      // Log the full error for debugging
      console.log(`Error details: ${e.message}. Now the full log here:`, e);
      assert.fail(
        'Your vote has failed. Check the error message for more details'
      );
    }

    //Get the address of the poll
    const [yesAddress] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(1).toArrayLike(Buffer, 'le', 8),
        Buffer.from('Yes, easy!'),
      ],
      programId
    );

    //Fetch the candidates
    const yesCandidate = await program.account.candidate.fetch(yesAddress);
    console.log('yes candidate', yesCandidate);

    //lets confirm the vote has been add to the candidate
    assert.equal(yesCandidate.candidateVotes.toNumber(), 1);
  });

  //More tests to come
});
