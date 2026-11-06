import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['node_modules/esbuild/bin/esbuild','node_modules/fengari/src/fengari.js','--bundle','--platform=browser','--format=iife','--global-name=fengari','--define:process=undefined','--define:process.env.FENGARICONF=undefined','--outfile=public/fengari.js','--minify'],{stdio:'inherit'});
