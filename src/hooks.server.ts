import { BACKEND_POCKETBASE_URL } from "$env/static/private";
import { type Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(BACKEND_POCKETBASE_URL);

	const response = await resolve(event);
	return response;
};
