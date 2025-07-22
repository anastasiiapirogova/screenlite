import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ['dist', 'node_modules', 'client']
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}']
    },
    {
        languageOptions: { globals: globals.node }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic/ts': stylisticTs
        },
        rules: {
            'newline-after-var': ['error', 'always'],
            'semi': ['error', 'never'],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'quotes': ['error', 'single'],
            'object-curly-spacing': ['error', 'always'],
            '@stylistic/ts/member-delimiter-style': ['error', {
                'multiline': {
                    'delimiter': 'none',
                    'requireLast': false
                },
                'singleline': {
                    'delimiter': 'comma',
                    'requireLast': false
                },
                'multilineDetection': 'brackets'
            }],
            '@stylistic/ts/indent': ['error', 4, { 'SwitchCase': 1 }],
        },
    },
]