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
	const requestFormData = await request.formData();
	const formDataObject = Object.fromEntries(requestFormData.entries()) as RequestBodyParams;

	if (!formDataObject.title) formDataObject.title = "New event";
	if (!formDataObject.type) formDataObject.type = "info";
	if (!formDataObject.message) formDataObject.message = "";
	if (!formDataObject.timestamp) {
		formDataObject.timestamp = DateTime.now().toSQL();
	} else {
		formDataObject.timestamp = DateTime.fromISO(formDataObject.timestamp).toSQL() as string;
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
			title: formDataObject.title,
			type: formDataObject.type,
			message: formDataObject.message,
			timestamp: formDataObject.timestamp,
		});
	} catch (err) {
		console.error("Error creating event:", err);
		error(500, "Failed to create event entry");
	}

	return json({ message: "Event created" });
};
