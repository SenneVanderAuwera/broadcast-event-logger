import { goto } from "$app/navigation";
import { getRecordingContext } from "$lib/context/recording.svelte";
import { pb } from "$lib/pocketbase";

export async function stopRecording(recordingCtx: ReturnType<typeof getRecordingContext>) {
	try {
		const res = await pb.collection("recording").update(recordingCtx.id, {
			stop: new Date().toISOString(),
		});
		recordingCtx.clear();
	} catch (err) {
		console.error("Error stopping recording");
	}
}

export async function startRecording(recordingCtx: ReturnType<typeof getRecordingContext>) {
	try {
		const recordingResponse = await pb.collection("recording").create({ start: new Date().toISOString() });
		recordingCtx.init(recordingResponse);
		goto(`/recordings/${recordingResponse.id}`);
	} catch (err) {
		console.error("Error creating recording");
	}
}
