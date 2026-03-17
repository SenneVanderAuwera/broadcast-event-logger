import { dev } from "$app/environment";
import { pb, type EventType } from "$lib/pocketbase";
import { Collections } from "$lib/pocketbase/types";
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
