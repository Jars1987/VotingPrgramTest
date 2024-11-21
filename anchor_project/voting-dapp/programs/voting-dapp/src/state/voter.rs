use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct Voter {
  #[max_len(32)]
  pub candidate_name: String,
  pub voter_key: Pubkey,
}