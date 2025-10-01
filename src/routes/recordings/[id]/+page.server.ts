import { pb } from "$lib/pocketbase";
import { ClientResponseError } from "pocketbase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	try {
		const eventsResponse = await pb.collection("event").getFullList({ filter: `recording="${params.id}"`, sort: "-created" });
		return { events: eventsResponse };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { events: [] };
	}
}) satisfies PageServerLoad;
