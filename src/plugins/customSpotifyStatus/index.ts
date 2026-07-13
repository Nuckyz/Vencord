/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    statusText: {
        type: OptionType.STRING,
        name: "Status Text",
        description: "The text to display in your Spotify status",
        default: "{song}"
    },
    detailsText: {
        type: OptionType.STRING,
        name: "Details Text",
        description: "The text to display in your Spotify details",
        default: "{artist}"
    }
});

interface SpotifyActivity {
    state: string;
    details: string;
}

export default definePlugin({
    name: "CustomSpotifyStatus",
    description: "",
    authors: [Devs.Nuckyz],
    settings,

    patches: [
        {
            find: '"LocalActivityStore"',
            replacement: [
                {
                    match: /(?<=\.LISTENING,)\.\.\.(\i)/,
                    replace: "...$self.modifiySpotifyActivity($1)"
                }
            ]
        }
    ],

    modifiySpotifyActivity(activity: SpotifyActivity) {
        const artist = activity.state;
        const song = activity.details;

        const REPLACEMENTS = {
            "{song}": song,
            "{artist}": artist
        };

        activity.state = settings.store.statusText;
        for (const [replacementString, replacementValue] of Object.entries(REPLACEMENTS)) {
            activity.state = activity.state.replace(replacementString, replacementValue);
        }

        activity.details = settings.store.detailsText;
        for (const [replacementString, replacementValue] of Object.entries(REPLACEMENTS)) {
            activity.details = activity.details.replace(replacementString, replacementValue);
        }

        return activity;
    }
});
