import {
  type RecordingEventsResponse,
  type RecordingsResponse,
} from "#lib/pocketbase/types.ts";
import { getRelativeDuration } from "#lib/utils/calculateRelativeDuration.ts";
import { DateTime } from "luxon";

function parseDateTime(value: string) {
  const sqlDateTime = DateTime.fromSQL(value);
  return sqlDateTime.isValid ? sqlDateTime : DateTime.fromISO(value);
}

function getEventColor(type: RecordingEventsResponse["type"], color?: string) {
  if (color) return color;
  if (type === "warning") return "Yellow";
  if (type === "error") return "Red";
  return "Blue";
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function exportRecordingEventsCsv(
  recording: RecordingsResponse,
  events: RecordingEventsResponse[]
) {
  const recordingStart = parseDateTime(recording.start);
  if (!recordingStart.isValid) return false;

  const rows: string[] = [];
  for (const event of events) {
    const eventTimestamp = parseDateTime(event.timestamp_in);
    const eventTimestampOut = event.timestamp_out
      ? parseDateTime(event.timestamp_out)
      : null;
    if (
      eventTimestampOut &&
      (!eventTimestamp.isValid ||
        !eventTimestampOut.isValid ||
        eventTimestampOut.toMillis() < eventTimestamp.toMillis())
    ) return false;
    const relativeTimestamp = eventTimestamp.isValid
      ? getRelativeDuration(recordingStart, eventTimestamp).toFormat("hh:mm:ss")
      : "";
    const actualTimestamp = eventTimestamp.isValid
      ? eventTimestamp.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
      : "";

    rows.push([
      getEventColor(event.type, event.color),
      event.title,
      event.message,
      relativeTimestamp,
      actualTimestamp,
      eventTimestampOut?.isValid
        ? eventTimestampOut.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
        : "",
      eventTimestampOut
        ? String(eventTimestampOut.diff(eventTimestamp).as("seconds"))
        : "",
    ]
      .map((value) => escapeCsvValue(value ?? ""))
      .join(","));
  }

  const csv = [
    ["Color", "Event name", "Event description", "Timecode", "Timestamp", "Timestamp out", "Duration (seconds)"]
      .map(escapeCsvValue)
      .join(","),
    ...rows,
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const recordingName =
    recording.recording_name.trim() ||
    recording.filename.trim() ||
    recording.id;
  const safeRecordingName =
    recordingName
      .replaceAll(/[^a-z0-9-_]+/gi, "-")
      .replaceAll(/^-+|-+$/g, "") || "recording";

  link.href = url;
  link.download = `${safeRecordingName}-events.csv`;
  link.click();
  URL.revokeObjectURL(url);

  return true;
}
