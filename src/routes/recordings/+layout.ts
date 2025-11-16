import { ClientResponseError } from "pocketbase";
import type { LayoutLoad } from "./$types";
import { pb } from "$lib/pocketbase";

export const load = (async ({ depends, fetch }) => {
	depends("recordings:non-archived");
	try {
		const recordingsResult = await pb.collection("recording").getFullList({ filter: "archived=false", sort: "-created", fetch });
		return { recordings: recordingsResult };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { recordings: [] };
	}
}) satisfies LayoutLoad;
