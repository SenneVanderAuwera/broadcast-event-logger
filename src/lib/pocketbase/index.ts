import { POCKETBASE_URL } from "$env/static/private";
import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./types";

export const pb: TypedPocketBase = new PocketBase(POCKETBASE_URL);
