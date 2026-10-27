import { metadata } from "reflect-metadata/no-conflict";
export const ROLES_KEY = "roles";
export const Roles=(...roles: string[]) => metadata(ROLES_KEY, roles);