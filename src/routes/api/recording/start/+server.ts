import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { DateTime } from "luxon";
import { ClientResponseError } from "pocketbase";

type RequestBodyParams = {
	start: string;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const requestFormData = await request.formData();
	const formDataObject = Object.fromEntries(requestFormData.entries()) as RequestBodyParams;

	let recordingStartTimeFromRequest = DateTime.fromISO(formDataObject.start);
	let recordingStartTime = DateTime.now();

	if (recordingStartTimeFromRequest.isValid) recordingStartTime = recordingStartTimeFromRequest;

	try {
		const recordingResponse = await locals.pb.collection("recording").create({ start: recordingStartTime.toSQL() });
	} catch (err) {
		if (err instanceof ClientResponseError) {
			if (err.data.data.stop.code === "validation_not_unique") {
				error(400, "Please stop the active recording before starting a new one");
			}
		}
		error(500, "Failed to create recording entry");
	}

	return json({ message: "New recording started" });
};
