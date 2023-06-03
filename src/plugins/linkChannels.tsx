/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Clipboard, Tooltip } from "@webpack/common";
import { Channel } from "discord-types/general";

function LinkChannelButton({ channel }: { channel: Channel; }) {
    return (
        <Tooltip text="Copy Channel Mention">
            {({ onMouseLeave, onMouseEnter }) => (
                <button
                    onMouseLeave={onMouseLeave}
                    onMouseEnter={onMouseEnter}
                    onClick={() => Clipboard.copy(`<#${channel.id}>`)}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path fill="var(--interactive-normal)" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                    </svg>
                </button>
            )}
        </Tooltip>
    );
}

export default definePlugin({
    name: "LinkChannels",
    description: "",
    authors: [Devs.Nuckyz],

    patches: [
        {
            find: "VoiceChannel.renderPopout: There must always be something to render",
            replacement: {
                match: /children:\[(?=.{0,200}renderEditButton\(\))(?<=channel:(\i),.+?)/g,
                replace: (m, channel) => `${m}$self.LinkChannelButton(${channel}),`,
            }
        }
    ],

    LinkChannelButton: (channel: Channel) => (
        <ErrorBoundary noop>
            <LinkChannelButton channel={channel} />
        </ErrorBoundary>
    )
});
