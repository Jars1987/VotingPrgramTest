use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id: u64,
  pub poll_owner: Pubkey,
  #[max_len(64)]
  pub poll_name: String,
  #[max_len(280)]
  pub poll_description: String,
  pub poll_start: u64,
  pub poll_end: u64,
  pub candidate_amount: u64,
  pub candidate_winner: Pubkey, //candidate with the most votes
}