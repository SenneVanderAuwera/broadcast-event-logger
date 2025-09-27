/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
    if(e.record.get("recording") == "") {
        try {
            let recordingRecord = $app.findFirstRecordByFilter("recording", "stop=null");

            e.record.set("recording", recordingRecord.get("id"));
            console.log("Linked event to recording " + recordingRecord.get("id"));
        } catch (err) {
            throw new NotFoundError("No open recording found");
        }
    } else {
        console.log("Recording already set, not overwriting");
        e.next()
    }
    
    e.next()
}, "event")