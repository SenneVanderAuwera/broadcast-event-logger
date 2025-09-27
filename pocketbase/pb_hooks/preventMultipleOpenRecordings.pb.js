/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
    // Check if there is any recording without a stop date
    try {
        let openRecording = $app.findFirstRecordByFilter("recording", "stop=null");

        if (openRecording) {
            throw new BadRequestError("Cannot create a new recording while another is still running");
        }
    } catch (err) {
        // If NotFoundError, no open recording exists, allow creation
        if (err instanceof NotFoundError) {
            e.next();
            return;
        }
        throw err;
    }
    e.next();
}, "recording");
