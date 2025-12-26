export const ROL_IDENTIFIERS = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type RolIdentifier =
  (typeof ROL_IDENTIFIERS)[keyof typeof ROL_IDENTIFIERS];