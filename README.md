# Voting Dapp

## Description

The Voting Dapp is an application that consists of:

- A Solana program that registers polls, candidates, and votes on the
  blockchain.
- A front-end built with Next.js that allows users to call instructions and
  interact with the program.

## How it works

Users can start by creating a new poll by clicking "Create Poll" on the landing
page. They will then be redirected to another page where they can fill in the
poll details. The front end will call the InitializePoll instruction from the
Voting Program. This instruction creates a Poll account and stores the poll
information within it.

After the poll is created, users can add up to 10 candidates. The front end will
call another instruction, InitiateCandidate, which saves the candidate
information in the respective Candidate account.

Once the poll is set up, it is ready for voting. Users can navigate to the "Poll
List" page. If the listed poll status is "Ongoing", it means the poll has
started, and users are allowed to vote. Poll owners cannot vote in their own
polls. To vote, users simply click on one of the poll candidates and confirm the
transaction. The front end will call the Vote instruction, which increases the
vote count for the selected candidate.

## Instalation

Use the following command to clone the repository:

`git clone https://github.com/School-of-Solana/program-Jars1987-1`

### Anchor

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

### Front End

Once the program is deployed, you can start interacting with the front end. The
front end is built with Next.js and was scaffolded with the solana-dapp
template.

1- Navigate to the voting-dapp folder inside the frontend directory:

`cd frontend/voting-dapp`

2- Install the necessary dependencies:

`npm i`

3 - Run the application locally:

`npm run dev`

4- Open your browser and go to:

`http://localhost:3000`

Ensure your wallet has enough $SOL to pay for transactions.

## Links

The program is deployed on devnet, and the front end is hosted on Vercel. You
can check it out using the link below:

https://voting-dapp-bay-nine.vercel.app/

## Future Implementations

This app is fairly basic. Aside from necessary UI improvements, several features
could be added:

- **Poll Detail Pages**: Create a dedicated page for each poll based on the
  pollId. On this page, users could post comments and like or dislike the poll.
- **Token-Gated Polls**: Implement token gating so that only signers holding a
  specific token type can vote. This feature would function similarly to the
  Jupiter voting website.
- **Monetization**: Charge a small fee (in lamports) for poll creation, which
  would be sent to a designated account.
