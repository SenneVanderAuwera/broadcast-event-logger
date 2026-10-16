import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./types";
import { PUBLIC_POCKETBASE_URL } from "$app/env/public";

export const pb: TypedPocketBase = new PocketBase(PUBLIC_POCKETBASE_URL);

export type EventType = "info" | "warning" | "error";
