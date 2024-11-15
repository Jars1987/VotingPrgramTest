use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Poll start must be before poll end")]
    InvalidPollTime,
    #[msg("Poll end must be in the future")]
    PollEndInThePast,
    #[msg("Description must be less than 280 characters")]
    DescriptionTooLong,
}