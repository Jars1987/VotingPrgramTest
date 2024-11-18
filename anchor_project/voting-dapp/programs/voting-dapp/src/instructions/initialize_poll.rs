use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::{Poll, ANCHOR_DESCRIMINATOR};

//---------------------------- CONTEXT ACCOUNTS ----------------------------//
#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(
    init, 
    payer = signer,
    space = ANCHOR_DESCRIMINATOR + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,
  pub system_program: Program<'info, System>
}

//---------------------------- INSTRUCTION ----------------------------//
pub fn initialize_poll(
  context: Context<InitializePoll>, 
  poll_id: u64, 
  name: String,
  description: String,
  poll_start: u64,
  poll_end: u64,
) -> Result<()> {
  let clock = Clock::get()?;


  require!(poll_start < poll_end, ErrorCode::InvalidPollTime); //this is comming as undefined, we need check why.
  require!(poll_end as i64 > clock.unix_timestamp, ErrorCode::PollEndInThePast);
  require!(description.len() < 280, ErrorCode::DescriptionTooLong);

  let poll = &mut context.accounts.poll;
  poll.poll_id = poll_id;
  poll.poll_owner = *context.accounts.signer.key;
  poll.poll_name = name;
  poll.poll_description = description;
  poll.poll_start = poll_start;
  poll.poll_end = poll_end;

  msg!("You have initialized a poll");
  Ok(())
}



