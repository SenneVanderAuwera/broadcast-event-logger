/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
    if(e.record.get("start") == "") {
        e.record.set("start", new Date().toISOString());
    } else {
        e.record.set("start", new Date(e.record.get("start")).toISOString());
    }


    e.next()
})