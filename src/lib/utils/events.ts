import { dev } from "$app/environment";
import { pb, type EventType } from "$lib/pocketbase";
import type { DateTime } from "luxon";

export async function createNewEvent(recordingId: string, type: EventType, timestamp: DateTime, message?: string) {
	try {
		const eventResponse = await pb.collection("event").create({
			recording: recordingId,
			type,
			timestamp: timestamp.toISO(),
			message,
		});
		return eventResponse;
	} catch (err) {
		if (dev) console.error(err);
		console.error("Error creating event");
	}
}
