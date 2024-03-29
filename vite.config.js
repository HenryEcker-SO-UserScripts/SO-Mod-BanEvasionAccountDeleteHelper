import stimulusHTMLComponents from './src/stimulus-components/prebuildable-stimulus-components';
import {buildMatchPatterns} from './banner-build-util';
import banner from 'vite-plugin-banner';
import packageConfig from './package.json';
import beautifyPlugin from './vite-plugin-beautify-output';
import filterReplace from 'vite-plugin-filter-replace';
import fs from 'fs';
import path from 'path';


const fileNameBase = 'BanEvasionAccountDeleteHelper';

const bannerText = `// ==UserScript==
// @name         Ban Evasion Account Delete Helper
// @description  Adds streamlined interface for deleting evasion accounts, then annotating and messaging the main accounts
// @homepage     ${packageConfig.repository.homepage}
// @author       Henry Ecker (https://github.com/HenryEcker)
// @version      ${packageConfig.version}
// @downloadURL  ${packageConfig.repository.dist_url}${fileNameBase}.user.js
// @updateURL    ${packageConfig.repository.dist_meta_url}${fileNameBase}.meta.js
//
${buildMatchPatterns('// @match        ', '/users/account-info/*')}
//
// @grant        none
//
// ==/UserScript==
/* globals StackExchange, Stacks, $ */`;

export default ({mode}) => {
    const config = {
        plugins: [
            beautifyPlugin({
                brace_style: 'collapse,preserve-inline'
            }),
            banner(bannerText),
            {
                closeBundle() {
                    const metaDir = path.resolve(__dirname, 'dist', 'meta');
                    if (!fs.existsSync(metaDir)) {
                        fs.mkdirSync(metaDir);
                    }
                    fs.writeFileSync(
                        path.resolve(metaDir, `${fileNameBase}.meta.js`),
                        bannerText
                    );
                }
            }
        ],
        define: {
            ...stimulusHTMLComponents
        },
        build: {
            rollupOptions: {
                input: {
                    main: `src/${fileNameBase}.user.ts`
                },
                output: {
                    format: 'iife',
                    manualChunks: undefined,
                    entryFileNames: `${fileNameBase}.user.js`
                }
            },
            minify: false,
            outDir: './dist',
            assetsDir: '',
            sourcemap: false,
            target: ['ESNext'],
            reportCompressedSize: false
        }
    };

    if (mode === 'testing') {
        config.plugins.push(
            filterReplace(
                [
                    // Replace (potentially) dangerous mod actions with the testing equivalents (simulated operations)
                    {
                        replace: {
                            from: /se-ts-userscript-utilities\/Moderators\/UserModActions/g,
                            to: 'se-ts-userscript-utilities/Moderators-Testing/UserModActions'
                        }
                    },
                    {
                        replace: {
                            from: 'window.location.reload();',
                            to: 'console.log(\'window.location.reload()\');'
                        }
                    }
                ],
                {enforce: 'pre'}
            )
        );
    }

    return config;
};