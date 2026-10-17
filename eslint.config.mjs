import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
export default [
 {ignores:['node_modules/**','dist/**','var/**','test-results/**','playwright-report/**']},
 js.configs.recommended,
 {files:['**/*.mjs'],languageOptions:{globals:{...globals.node}},rules:{'no-unused-vars':['warn',{argsIgnorePattern:'^_',caughtErrors:'none',varsIgnorePattern:'^_'}]}},
 ...ts.configs.recommended.map(c=>({...c,files:['**/*.ts']})),
 {files:['**/*.ts'],languageOptions:{globals:{...globals.browser,...globals.node}},rules:{'@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-vars':['warn',{argsIgnorePattern:'^_',caughtErrors:'none',varsIgnorePattern:'^_'}]}},
];
