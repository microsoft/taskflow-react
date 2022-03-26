import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
export default [
    {
        input: "./cli/Cli.ts",
        output: {
            file: './bin/cli.js',
            format: 'cjs',
        },
        plugins: [
            typescript(),
        ],
        external: [
            "fs",
            "path",
            "process",
            "typescript",
            "react",
            "commander",
            "child_process"
        ]
    },
    {
        input: "./src/index.tsx",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    },    
    {
        input: './src/index.tsx',
        output: {
            file: './dist/index.js',
            format: 'esm',
        },
        plugins: [
            typescript(),
            terser({output: {comments: function (node, comment){return false}}}),
        ],
        external: [
            "fs",
            "path",
            "process",
            "typescript",
            "react"
        ]
    },
    {
        input: './src/index.tsx',
        output: {
            file: './dist/index.cjs.js',
            format: 'cjs',
        },
        plugins: [
            typescript(),
            terser({output: {comments: function (node, comment){return false}}}),
        ],
        external: [
            "fs",
            "path",
            "process",
            "typescript",
            "react"
        ]
    }
]