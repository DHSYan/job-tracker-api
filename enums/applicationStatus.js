const ApplicationStatus = Object.freeze({
  SAVED: 'saved',
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFERED: 'offered',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
})

function isValidStatus(s) {
  return Object.values(ApplicationStatus).includes(s);
}

module.exports = {
  ApplicationStatus,
  isValidStatus
}

