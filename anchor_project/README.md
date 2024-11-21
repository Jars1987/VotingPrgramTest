# Voting Dapp

## Description

The Voting Dapp program consists of:

- A Solana program that registers polls, candidates, and votes on the
  blockchain.

## How it works

1- Creating a Poll: The InitializePoll instruction is called to create a Poll
account and store the poll's details on the blockchain.

2- Adding Candidates: The InitiateCandidate instruction is used to create
Candidate accounts and store the respective candidate information. Each poll can
have up to 10 candidates.

3- Voting: The Vote instruction is called to update the vote count on the
selected Candidate account. This ensures the voting process is securely recorded
on-chain. Poll owners are restricted from voting in their own polls.

## Instalation

1- After cloning the repository, navigate to the voting-dapp folder inside the
anchor_project directory:

`cd anchor_project/voting-dapp`

2- Install the necessary dependencies:

`cargo build`

3- Build your program:

`anchor build`

4- Deploy the program: Ensure the Solana CLI is configured to localnet and
running in another terminal. Also, make sure the public key from your
CLI-generated keypair has enough $SOL. Then, run:

`anchor deploy`

5- Sync all program keys:

` anchor keys sync`

6- Run the tests:

`anchor test --skip-local-validator`

If you plan to re-run the same tests and initialize the same accounts, you must
reset the validator before starting a new test. Use this command:

`solana-test-validator -r`
