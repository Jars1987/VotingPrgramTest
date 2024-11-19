use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::{Poll, Candidate, ANCHOR_DESCRIMINATOR};

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct Vote<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>,

  pub system_program: Program<'info, System>
}


pub fn vote(ctx: Context<Vote>, poll_id: u64, candidate_name: String) -> Result<()> {
  let poll = &mut ctx.accounts.poll;
  let candidate = &mut ctx.accounts.candidate;
  let current_time = Clock::get()?.unix_timestamp;

  require!(poll.poll_start as i64 <= current_time, ErrorCode::PollNotStarted);
  require!(poll.poll_end as i64 > current_time, ErrorCode::PollEnded);

  // Add a check to make sure that the signer has not already voted
  /*
    if poll.voters.contains(&ctx.accounts.signer.key) {
    return Err(ErrorCode::AlreadyVoted.into());}
   */

  candidate.candidate_votes += 1;
  msg!("You have voted for a candidate called {} that now has {} votes.", candidate_name, candidate.candidate_votes);
  Ok(())
}




