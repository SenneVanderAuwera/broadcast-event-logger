import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const recordings = await locals.pb.collection("recording").getFullList();
		return json({ data: recordings });
	} catch (err) {
		console.error("Error fetching recordings:", err);
		error(500, "Failed to fetch recordings");
	}
};
