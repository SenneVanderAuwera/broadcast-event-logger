import { dev } from "$app/env";
import { pb, type EventType } from "#lib/pocketbase/index.js";
import { Collections } from "#lib/pocketbase/types.js";
import type { DateTime } from "luxon";

export async function createNewEvent(recordingId: string, type: EventType, timestamp: DateTime, message?: string) {
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
