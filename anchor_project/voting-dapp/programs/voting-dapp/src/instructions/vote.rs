use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::{Poll, Candidate, Voter, ANCHOR_DESCRIMINATOR};

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

  #[account(
    init, 
    payer = signer, 
    space = ANCHOR_DESCRIMINATOR + Voter::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(), signer.key().as_ref()],
    bump
  )]
  pub voter: Account<'info, Voter>,

  pub system_program: Program<'info, System>
}


pub fn vote(ctx: Context<Vote>, poll_id: u64, candidate_name: String) -> Result<()> {
  let poll = &mut ctx.accounts.poll;
  let candidate = &mut ctx.accounts.candidate;
  let voter = &mut ctx.accounts.voter;
  let current_time = Clock::get()?.unix_timestamp * 1000;

  
  require!(current_time > poll.poll_start as i64, ErrorCode::PollNotStarted);
  require!(poll.poll_end as i64 > current_time, ErrorCode::PollEnded);

  voter.candidate_name = candidate_name;
  voter.voter_key = *ctx.accounts.signer.key;
  candidate.candidate_votes += 1;

  msg!("You have voted for a candidate called {} that now has {} votes.", candidate.candidate_name, candidate.candidate_votes);
  Ok(())
}




