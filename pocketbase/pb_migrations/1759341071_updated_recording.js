/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_NdmG3bP36u` ON `recording` (`stop`) WHERE stop != NULL"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3749236171")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_NdmG3bP36u` ON `recording` (`stop`) WHERE stop != \"\""
    ]
  }, collection)

  return app.save(collection)
})
