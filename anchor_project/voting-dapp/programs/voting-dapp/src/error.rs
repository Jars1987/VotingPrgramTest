use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Poll start must be before poll end")]
    InvalidPollTime,
    #[msg("Poll end must be in the future")]
    PollEndInThePast,
    #[msg("Description must be less than 280 characters")]
    DescriptionTooLong,
    #[msg("Unable to initialize a new candidat. Poll has already ended")]
    PollEnded,
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Exceeded the maximum number of candidates")]
    TooManyCandidates,
    #[msg("Poll has not started yet")]
    PollNotStarted,
    #[msg("You have already voted")]
    AlreadyVoted
}