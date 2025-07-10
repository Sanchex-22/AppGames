/**
 * Lightweight in-memory shim that satisfies all database-related imports
 * after removing SQLite.  None of these helpers touch the network or disk.
 * Feel free to replace or delete once every API route that referenced
 * a real database has been removed.
 */

/* ---------- User helpers ---------- */
export const userQueries = {
  create: (user: any) => Promise.resolve(user),
  findByUsername: (_username: string) => Promise.resolve(null),
  findAll: () => Promise.resolve([]),
  update: (id: string | number, changes: any) => Promise.resolve({ id, ...changes }),
  delete: (_id: string | number) => Promise.resolve({}),
}

/* ---------- Session helpers ---------- */
export const sessionQueries = {
  create: (session: any) => Promise.resolve(session),
  findByToken: (_token: string) => Promise.resolve(null),
  delete: (_sessionId: string | number) => Promise.resolve({}),
}

/* ---------- Business Idea helpers ---------- */
export const businessIdeaQueries = {
  findAll: () => Promise.resolve([]),
  create: (idea: any) => Promise.resolve(idea),
  update: (id: string | number, changes: any) => Promise.resolve({ id, ...changes }),
  delete: (_id: string | number) => Promise.resolve({}),
}

/* ---------- Chat helpers ---------- */
export const chatQueries = {
  findByGroup: (_group: string) => Promise.resolve([]),
  create: (message: any) => Promise.resolve(message),
  delete: (_messageId: string | number) => Promise.resolve({}),
}

/* ---------- Progress helpers ---------- */
export const progressQueries = {
  findByUser: (_userId: string | number) => Promise.resolve(null),
  create: (progress: any) => Promise.resolve(progress),
  update: (id: string | number, changes: any) => Promise.resolve({ id, ...changes }),
}

/* ---------- Round helpers ---------- */
export const roundQueries = {
  findByProgress: (_progressId: string | number) => Promise.resolve([]),
  create: (round: any) => Promise.resolve(round),
  update: (id: string | number, changes: any) => Promise.resolve({ id, ...changes }),
}

/* ---------- User Idea helpers ---------- */
export const userIdeaQueries = {
  findAll: () => Promise.resolve([]),
  create: (userIdea: any) => Promise.resolve(userIdea),
  update: (id: string | number, changes: any) => Promise.resolve({ id, ...changes }),
  delete: (_id: string | number) => Promise.resolve({}),
}

/* ---------- Transaction helpers ---------- */
export const transactions = {
  run: (callback: () => any) => callback(),
}
