import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, fetch }) => {
	try {
		const recordingsResult = await locals.pb.collection("recording").getFullList({ filter: "archived=false", sort: "-created", fetch });

		console.log(recordingsResult);

		return { recordings: recordingsResult };
	} catch (err) {
		console.log(err);
		error(500, "Failed to fetch recordings");
	}
}) satisfies PageServerLoad;
