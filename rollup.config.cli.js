import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
export default [
    {
        input: './cli/Cli.ts',
        output: {
            file: './bin/cli.js',
            format: 'cjs',
            banner: `#!/usr/bin/env node
            `,
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
            "react",
            "commander",
            "child_process"
        ]
    }
]