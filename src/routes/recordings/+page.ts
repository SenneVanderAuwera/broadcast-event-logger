import { ClientResponseError } from "pocketbase";
import type { PageLoad } from "./$types";
import { pb } from "$lib/pocketbase";

export const load = (async ({ fetch, depends }) => {}) satisfies PageLoad;
