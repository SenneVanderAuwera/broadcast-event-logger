import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { DateTime } from "luxon";
import { Collections, type RecordingsResponse } from "#lib/pocketbase/types.ts";
import { ClientResponseError } from "pocketbase";

type RequestBodyParams = {
  title?: string;
  timestamp_in?: string;
  message?: string;
  type?: "info" | "warning" | "error";
  color?: string;
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const requestBody: RequestBodyParams = await request.json();

  if (!requestBody.title) requestBody.title = "New event";
  if (!requestBody.type) requestBody.type = "info";
  if (!requestBody.message) requestBody.message = "";
  if (!requestBody.timestamp_in) {
    requestBody.timestamp_in = DateTime.now().toSQL();
  } else {
    requestBody.timestamp_in = DateTime.fromISO(
      requestBody.timestamp_in
    ).toSQL() as string;
  }

  let activeRecording: RecordingsResponse | undefined = undefined;

  try {
    activeRecording = await locals.pb
      .collection(Collections.Recordings)
      .getFirstListItem(`stop=null`);
  } catch (err) {
    if (err instanceof ClientResponseError) {
      if (err.status === 404) {
        error(400, "No active recording found");
      }
    }
  }

  try {
    const RecordingEventsResponse = await locals.pb
      .collection(Collections.RecordingEvents)
      .create({
        recording: activeRecording?.id,
        title: requestBody.title,
        type: requestBody.type,
        message: requestBody.message,
        color: requestBody.color,
        timestamp_in: requestBody.timestamp_in,
      });
    return Response.json({ message: "Event created", data: RecordingEventsResponse });
  } catch (err) {
    console.error("Error creating event:", err);
    error(500, "Failed to create event entry");
  }
};
