import { error } from "@sveltejs/kit";
import { ClientResponseError } from "pocketbase";
import { DateTime } from "luxon";
import {
  Collections,
  RecordingEventsTypeOptions,
  type RecordingEventsRecord,
  type RecordingEventsResponse,
  type RecordingsResponse,
} from "#lib/pocketbase/types.ts";
import type { RequestHandler } from "./$types";

type EventUpdate = Partial<
  Pick<
    RecordingEventsRecord,
    "title" | "message" | "type" | "color" | "timestamp_in" | "timestamp_out"
  >
>;

function parseStoredDate(value: string) {
  const date = DateTime.fromSQL(value, { setZone: true });
  return date.isValid ? date : DateTime.fromISO(value, { setZone: true });
}

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    if (err instanceof SyntaxError) error(400, "Invalid JSON");
    throw err;
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    error(400, "Expected an object");

  const fields = Object.keys(body);
  const allowed = ["title", "message", "type", "color", "timestamp_in", "timestamp_out"];
  if (fields.length === 0 || fields.some((field) => !allowed.includes(field)))
    error(400, "Provide valid event fields to update");

  const input = body as Record<string, unknown>;
  const update: EventUpdate = {};
  for (const field of ["title", "message", "color"] as const) {
    if (field in input) {
      const value = input[field];
      if (typeof value !== "string" || (field === "title" && !value.trim()))
        error(400, `Invalid ${field}`);
      update[field] = value;
    }
  }
  if ("type" in input) {
    if (
      input.type !== RecordingEventsTypeOptions.info &&
      input.type !== RecordingEventsTypeOptions.warning &&
      input.type !== RecordingEventsTypeOptions.error
    ) error(400, "Invalid type");
    update.type = input.type;
  }
  for (const field of ["timestamp_in", "timestamp_out"] as const) {
    if (field in input) {
      const value = input[field];
      if (field === "timestamp_out" && (value === null || value === "")) {
        update.timestamp_out = "";
      } else {
        if (typeof value !== "string") error(400, `Invalid ${field}`);
        const date = DateTime.fromISO(value, { setZone: true });
        if (!date.isValid) error(400, `Invalid ${field}`);
        update[field] = date.toUTC().toISO();
      }
    }
  }

  let event: RecordingEventsResponse;
  let recording: RecordingsResponse;
  try {
    event = await locals.pb.collection(Collections.RecordingEvents).getOne(params.id);
    recording = await locals.pb.collection(Collections.Recordings).getOne(event.recording);
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404)
      error(404, "Event or recording not found");
    console.error("Error loading event:", err);
    error(500, "Failed to load event");
  }
  if (recording.archived) error(403, "Archived recordings are read-only");

  const timestampIn = parseStoredDate(update.timestamp_in ?? event.timestamp_in);
  const outValue = update.timestamp_out ?? event.timestamp_out;
  const timestampOut = outValue ? parseStoredDate(outValue) : null;
  if (!timestampIn.isValid || (timestampOut && !timestampOut.isValid))
    error(400, "Invalid event timestamps");
  if (timestampOut && timestampOut.toMillis() < timestampIn.toMillis())
    error(400, "timestamp_out must not be earlier than timestamp_in");

  try {
    const updated = await locals.pb
      .collection(Collections.RecordingEvents)
      .update(event.id, update);
    return Response.json({ message: "Event updated", data: updated });
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404)
      error(404, "Event not found");
    console.error("Error updating event:", err);
    error(500, "Failed to update event");
  }
};
