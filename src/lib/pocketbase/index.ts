import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./types";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

export const pb: TypedPocketBase = new PocketBase(PUBLIC_POCKETBASE_URL);
