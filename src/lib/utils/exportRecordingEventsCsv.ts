import { type RecordingEventsResponse, type RecordingsResponse } from "$lib/pocketbase/types";
import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
import { DateTime } from "luxon";

function parseDateTime(value: string) {
	const sqlDateTime = DateTime.fromSQL(value);
	return sqlDateTime.isValid ? sqlDateTime : DateTime.fromISO(value);
}

function getEventColor(type: RecordingEventsResponse["type"]) {
	if (type === "warning") return "Yellow";
	if (type === "error") return "Red";
	return "Blue";
}

function escapeCsvValue(value: string) {
	return `"${value.replaceAll('"', '""')}"`;
}

export function exportRecordingEventsCsv(recording: RecordingsResponse, events: RecordingEventsResponse[]) {
	const recordingStart = parseDateTime(recording.start);
	if (!recordingStart.isValid) return false;

	const rows = events.map((event) => {
		const eventTimestamp = parseDateTime(event.timestamp);
		const relativeTimestamp = eventTimestamp.isValid
			? getRelativeDuration(recordingStart, eventTimestamp).toFormat("hh:mm:ss")
			: "";
		const actualTimestamp = eventTimestamp.isValid
			? eventTimestamp.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
			: "";

		return [getEventColor(event.type), event.title, event.message, relativeTimestamp, actualTimestamp]
			.map((value) => escapeCsvValue(value ?? ""))
			.join(",");
	});

	const csv = [
		["Color", "Event name", "Event description", "Timecode", "Timestamp"].map(escapeCsvValue).join(","),
		...rows
	].join("\r\n");

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	const recordingName = recording.recording_name.trim() || recording.filename.trim() || recording.id;
	const safeRecordingName = recordingName.replaceAll(/[^a-z0-9-_]+/gi, "-").replaceAll(/^-+|-+$/g, "") || "recording";

	link.href = url;
	link.download = `${safeRecordingName}-events.csv`;
	link.click();
	URL.revokeObjectURL(url);

	return true;
}