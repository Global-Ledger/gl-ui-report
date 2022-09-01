module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
  ],
  plugins: [
    "vue",
  ],
  settings: {
    "import/resolver": "webpack",
    "import/extensions": [
      ".js",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/require-prop-type-constructor': 'warn',
    'vue/multiline-html-element-content-newline': 'warn',
    'vue/html-closing-bracket-newline': ['warn', {
      'singleline': 'never',
      'multiline': 'always',
    }],
    'vue/html-self-closing': ['warn', {
      'html': {
        'void': 'never',
        'normal': 'always',
        'component': 'always',
      },
      'svg': 'always',
      'math': 'always',
    }],
    "vue/max-attributes-per-line": ["warn", {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/attributes-order": ["warn", {
      "order": [
        "DEFINITION",
        "LIST_RENDERING",
        "CONDITIONALS",
        "RENDER_MODIFIERS",
        "GLOBAL",
        "UNIQUE",
        "TWO_WAY_BINDING",
        "OTHER_DIRECTIVES",
        "OTHER_ATTR",
        "EVENTS",
        "CONTENT"
      ],
      "alphabetical": true
    }]
  },
}
