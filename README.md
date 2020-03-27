# Gatsby image from GraphQL schema

## Use case

This plugin generates fileNodes in your graphQL schema and add `File` type to it. You can now use
gatsby-plugin-sharp and gatsby-transformer-sharp in your GraphQL schema.

## Installation

Add plugin to your project's dependencies
```
yarn add gatsby-image-graphql-schema
```
Update and configure plugin in your `gatsby-config` file :
```
...
{
  resolve: "gatsby-image-graphql-schema",
  options: {
    imageNames: ["url"],
    schemaTypeName: "drupal",
  },
},
```
- `imageNames` is the names of the fields where your images url appears in your graphQL schema
- `schemaTypeName` is the root schema type name where the plugin will search in to transform your images.
(you must have the same value as the `typeName` options in the `gatsby-source-graphql` plugin).
- `baseUrl` [optional] this can be add to the plugin options to concatenate imageUrl with an existing website 
(usefull when you only have the name of your images in your query result)

## Result

You can now query your images and they come with access to `childImageSharp` feature :
```
thumbnail {
  url
  urlSharp {
    childImageSharp {
      fixed(width: 500, height: 500) {
        ...GatsbyImageSharpFixed_withWebp
      }
    }
  }
}
```
