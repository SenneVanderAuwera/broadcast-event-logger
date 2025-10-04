import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { DateTime } from "luxon";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";

type RequestBodyParams = {
	title?: string;
	timestamp?: string;
	message?: string;
	type?: "info" | "warning" | "error";
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const requestBody: RequestBodyParams = await request.json();

	if (!requestBody.title) requestBody.title = "New event";
	if (!requestBody.type) requestBody.type = "info";
	if (!requestBody.message) requestBody.message = "";
	if (!requestBody.timestamp) {
		requestBody.timestamp = DateTime.now().toSQL();
	} else {
		requestBody.timestamp = DateTime.fromISO(requestBody.timestamp).toSQL() as string;
	}

	let activeRecording: RecordingResponse | undefined = undefined;

	try {
		activeRecording = await locals.pb.collection("recording").getFirstListItem(`stop=null`);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			if (err.status === 404) {
				error(400, "No active recording found");
			}
		}
	}

	try {
		const eventResponse = await locals.pb.collection("event").create({
			recording: activeRecording?.id,
			title: requestBody.title,
			type: requestBody.type,
			message: requestBody.message,
			timestamp: requestBody.timestamp,
		});
	} catch (err) {
		console.error("Error creating event:", err);
		error(500, "Failed to create event entry");
	}

	return json({ message: "Event created" });
};
