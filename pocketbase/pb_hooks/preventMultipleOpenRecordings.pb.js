/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
	// Check if there is any recording without a stop date
	try {
		let openRecording = $app.findFirstRecordByFilter("recording", "stop=null");

		if (openRecording) {
			throw new BadRequestError("Cannot create a new recording while another is still running");
		} else {
			throw new NotFoundError("No open recording found, allowing creation");
		}
	} catch (err) {
		if (err instanceof GoError) {
			// No open recording found, allow creation
			e.next();
			return;
		} else {
			console.log(err);
			throw err;
		}
	}
}, "recording");
