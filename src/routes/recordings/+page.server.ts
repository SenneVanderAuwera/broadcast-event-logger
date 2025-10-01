import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	try {
		const recordingsResult = await locals.pb.collection("recording").getFullList({ filter: "archived=false", sort: "-created" });
		const activeRecordingResult = await locals.pb.collection("recording").getFirstListItem("stop=''", { fields: "id" });

		return { recordings: recordingsResult, activeRecording: activeRecordingResult || null };
	} catch (err) {
		console.log(err);
		error(500, "Failed to fetch recordings");
	}
}) satisfies PageServerLoad;
