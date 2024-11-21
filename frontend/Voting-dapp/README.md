# Voting Dapp

## Description

The Voting Dapp is an application that consists of:

- A front-end built with Next.js that allows users to call instructions and
  interact with the Solana Voting Program. They will be able to create polls and
  vote.

## How it works

1- Creating a Poll: Users can create a poll by clicking the "Create Poll" button
on the landing page. They are then redirected to a new page where they can fill
in the poll details and submit the poll the blockchain.

2- Adding Candidates: After creating the poll, the newly created poll will spaw
below the "Create Poll" form. Users can add candidates to the poll to a maximum
of 10 candidates per poll.

3- Voting: Once the poll is set up, users navigate to the "Poll List" page. If
the poll status is "Ongoing", users can vote by clicking on one of the poll
candidates. The candidate's vote count will then be updated.

## Instalation

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
