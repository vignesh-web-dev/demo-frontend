function importMetaEnvPlugin({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        if (
          t.isMetaProperty(path.node.object) &&
          path.node.object.meta.name === 'import' &&
          path.node.object.property.name === 'meta' &&
          t.isIdentifier(path.node.property) &&
          path.node.property.name === 'env'
        ) {
          path.replaceWith(
            t.memberExpression(t.identifier('process'), t.identifier('env'))
          )
        }
      },
    },
  }
}

export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [importMetaEnvPlugin],
}
