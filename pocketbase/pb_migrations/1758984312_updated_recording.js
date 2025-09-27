/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // remove field
  collection.fields.removeById("autodate2675529103")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date2675529103",
    "max": "",
    "min": "",
    "name": "start",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "autodate2675529103",
    "name": "start",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("date2675529103")

  return app.save(collection)
})
