const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.createResolvers = (
  { actions, cache, createNodeId, createResolvers, store, reporter },
  configOptions
) => {
  const { createNode } = actions
  const { imageNames, schemaTypeName } = configOptions
  if (!imageNames || !Array.isArray(imageNames)) {
    throw new Error("No image names were given in gatsby image graphql plugin.")
  }

  const state = store.getState()
  const schema = state.schemaCustomization.thirdPartySchemas.filter(
    schemaPart => schemaPart._typeMap[schemaTypeName]
  )[0]

  if (!schema) {
    throw new Error(`Schema: '${schemaTypeName} was not found.'`)
  }

  const typeMap = schema._typeMap
  const resolvers = {}

  Object.keys(typeMap).forEach(typeName => {
    const typeEntry = typeMap[typeName]
    const typeFields =
      (typeEntry && typeEntry.getFields && typeEntry.getFields()) || {}
    const typeResolver = {}
    Object.keys(typeFields).forEach(fieldName => {
      if (imageNames.includes(fieldName)) {
        typeResolver[`${fieldName}Sharp`] = {
          type: "File",
          resolve(source) {
            const url = source[fieldName]
            if (url) {
              return createRemoteFileNode({
                url,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              })
            }
            return null
          },
        }
      }
      if (Object.keys(typeResolver).length) {
        resolvers[typeName] = typeResolver
      }
    })
    if (Object.keys(resolvers).length) {
      createResolvers(resolvers)
    }
  })
}
