import { ClientResponseError } from "pocketbase";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	try {
		const activeRecordingResult = await locals.pb.collection("recording").getFirstListItem("stop=''", { fields: "id" });
		return { activeRecording: activeRecordingResult };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { activeRecording: null };
	}
}) satisfies LayoutServerLoad;
