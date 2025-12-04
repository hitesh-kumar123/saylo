// In-memory mock database
// TODO: Replace with actual database (PostgreSQL, MongoDB, etc.)

export const db = {
  users: [],
  resumes: [],
  interviews: [],
  careerPaths: [],
};

export const resetDatabase = () => {
  db.users = [];
  db.resumes = [];
  db.interviews = [];
  db.careerPaths = [];
};
