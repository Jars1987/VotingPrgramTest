use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::{Poll, Candidate, ANCHOR_DESCRIMINATOR};

#[derive(Accounts)]
#[instruction(candidate_name: String ,poll_id: u64)]
pub struct InitializeCandidate<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(
    init, 
    payer = signer,
    space = ANCHOR_DESCRIMINATOR + Candidate::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>,

  #[account(
    mut,   
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  pub system_program: Program<'info, System>
}

pub fn initialize_candidate(
  context: Context<InitializeCandidate>, 
  candidate_name: String,
  poll_id: u64,
) -> Result<()> {
  let candidate = &mut context.accounts.candidate;
  let poll = &mut context.accounts.poll;
  let clock = Clock::get()?;

  /* 
  msg!("poll_start: {}", poll.poll_start as i64);
  msg!("clock.unix_timestamp: {}", clock.unix_timestamp);
  msg!("Poll start < clock.unix_timestamp: {}", poll.poll_start as i64 > clock.unix_timestamp);
  msg!("poll_end: {}", poll.poll_end as i64);
  msg!("Poll end < clock.unix_timestamp: {}", poll.poll_end as i64 <= clock.unix_timestamp);
  
  require!(poll.poll_end as i64 <= clock.unix_timestamp, ErrorCode::PollEnded);
  require!(poll.poll_start as i64 > clock.unix_timestamp, ErrorCode::PollNotStarted);
  */
  require!(poll.poll_owner == *context.accounts.signer.key, ErrorCode::Unauthorized);
  require!(poll.candidate_amount + 1 <= 10, ErrorCode::TooManyCandidates);
  

  candidate.candidate_name = candidate_name;
  candidate.candidate_votes = 0;

  poll.candidate_amount += 1;

  msg!("You have initialized a candidate called and added them to the poll");
  Ok(())
}