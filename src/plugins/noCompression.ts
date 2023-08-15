/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoCompression",
    description: "",
    authors: [Devs.Nuckyz],
    patches: [
        {
            find: ".reactNativeCompressAndExtractData=function",
            replacement: {
                match: /(?<=reactNativeCompressAndExtractData=function\(\){)/,
                replace: "return;"
            }
        }
    ]
});
