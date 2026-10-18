import { Collections, RecordingEventsTypeOptions } from "#lib/pocketbase/types.js";

import type { DateTime } from "luxon";
import { dev } from "$app/env";
import { pb } from "#lib/pocketbase/index.svelte.js";

export async function createNewEvent(recordingId: string, type: RecordingEventsTypeOptions, timestamp: DateTime, message?: string) {
	try {
		const RecordingEventsResponse = await pb.collection(Collections.RecordingEvents).create({
			recording: recordingId,
			type,
			timestamp: timestamp.toISO(),
			message,
		});
		return RecordingEventsResponse;
	} catch (err) {
		if (dev) console.error(err);
		console.error("Error creating event");
	}
}
