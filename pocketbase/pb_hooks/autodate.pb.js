/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
    if(e.record.get("start") == "") {
        e.record.set("start", new Date().toISOString());
    } else {
        e.record.set("start", new Date(e.record.get("start")).toISOString());
    }

    e.next()
}, "recording")

onRecordCreateRequest((e) => {
    if(e.record.get("timestamp") == "") {
        e.record.set("timestamp", new Date().toISOString());
    } else {
        e.record.set("timestamp", new Date(e.record.get("timestamp")).toISOString());
    }

    e.next()
}, "event")