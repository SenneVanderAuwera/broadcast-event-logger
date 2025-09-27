import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	try {
		const recordingsResult = await locals.pb.collection("recording").getFullList({ filter: "archived=false", sort: "-created" });
		return { recordings: recordingsResult };
	} catch (err) {
		error(500, "Failed to fetch recordings");
	}
}) satisfies PageServerLoad;
