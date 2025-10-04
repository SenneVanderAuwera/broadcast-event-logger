import { ClientResponseError } from "pocketbase";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, fetch }) => {
	try {
		const activeRecordingResult = await locals.pb.collection("recording").getFirstListItem("stop=''", { fields: "id", fetch });
		return { activeRecording: activeRecordingResult };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { activeRecording: undefined };
	}
}) satisfies LayoutServerLoad;
