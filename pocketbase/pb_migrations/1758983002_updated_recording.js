/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "[a-z0-9]{5}",
    "hidden": false,
    "id": "text1649243299",
    "max": 0,
    "min": 0,
    "name": "recording_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "[a-z]{5}",
    "hidden": false,
    "id": "text1649243299",
    "max": 0,
    "min": 0,
    "name": "recording_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
