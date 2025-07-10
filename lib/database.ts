/**
 * Lightweight in-memory shim that satisfies all database-related imports
 * after removing SQLite.  None of these helpers touch the network or disk.
 * Feel free to replace or delete once every API route that referenced
 * a real database has been removed.
 */

/* ---------- User helpers ---------- */
export const userQueries = {
  all: () => [] as any[],
  findById: (_id: string | number) => null,
  create: (user: any) => user,
  update: (id: string | number, changes: any) => id,
  remove: (_id: string | number) => true,
}

/* ---------- Session helpers ---------- */
export const sessionQueries = {
  active: () => [] as any[],
  create: (session: any) => session,
  end: (_sessionId: string | number) => true,
}

/* ---------- Stubs for other previously-requested exports ---------- */
export const businessIdeaQueries = {}
export const chatQueries = {}
export const progressQueries = {}
export const roundQueries = {}
export const transactions = {}
export const userIdeaQueries = {}
