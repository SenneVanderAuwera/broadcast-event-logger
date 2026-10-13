import type { Handle } from "@sveltejs/kit/hooks";
import { BACKEND_POCKETBASE_URL } from "$app/env/private";
import PocketBase from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(BACKEND_POCKETBASE_URL);

	const response = await resolve(event);
	return response;
};
