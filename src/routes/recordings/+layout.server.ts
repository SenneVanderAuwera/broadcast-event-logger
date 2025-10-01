import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	try {
		const activeRecordingResult = await locals.pb.collection("recording").getFirstListItem("stop=''", { fields: "id" });
		return { activeRecording: activeRecordingResult || null };
	} catch (err) {
		console.error(err);
		return {};
	}
}) satisfies LayoutServerLoad;
