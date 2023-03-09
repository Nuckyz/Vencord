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

import { definePluginSettings } from "@api/settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Forms, React } from "@webpack/common";

const IGNORED_NOTICES_PREDICATES = [
    "QUARANTINED",
    "HARDWARE_MUTE",
    "H264_DISABLED",
    "DISPATCH_ERROR",
    "DISPATCH_INSTALL_SCRIPT_PROGRESS",
    "SPOTIFY_AUTO_PAUSED",
    "DROPS_PROGRESS_INTERRUPTION",
    "CALLSCOPE_MONITORING",
    "UNCLAIMED_ACCOUNT",
    "PENDING_MEMBER",
    "OUTBOUND_PROMOTION",
    "CORRUPT_INSTALLATION",
    "VIDEO_UNSUPPORTED_BROWSER",
    "DETECTED_OFF_PLATFORM_PREMIUM_PERK",
    "DETECTED_OFF_PLATFORM_PREMIUM_PERK_UPSELL",
    "SCHEDULED_MAINTENANCE",
    "UNVERIFIED_ACCOUNT",
    "PREMIUM_TIER_2_TRIAL_ENDING",
    "PREMIUM_TIER_0_TRIAL_ENDING",
    "PREMIUM_PROMO",
    "PREMIUM_UNCANCEL",
    "PREMIUM_MISSING_PAYMENT",
    "PREMIUM_PAST_DUE_INVALID_PAYMENT",
    "PREMIUM_PAST_DUE_MISSING_PAYMENT",
    "PREMIUM_PAST_DUE_ONE_TIME_PAYMENT",
    "PREMIUM_REACTIVATE",
    "PREMIUM_TIER_0",
    "ACTIVATE_SERVER_SUBSCRIPTION",
    "MFA_SMS_BACKUP",
    "APPLICATION_TEST_MODE",
    "LOCALIZED_PRICING",
    "DOWNLOAD_NAG",
    "CONNECT_SPOTIFY",
    "CONNECT_PLAYSTATION",
    "SURVEY",
    "DROPS_GO_LIVE_BANNER",
    "DROPS_ENDED_INCOMPLETE"
];

const settings = definePluginSettings({
    filterNoticeStorePredicates: {
        type: OptionType.BOOLEAN,
        description: "Whether to filter and remove relatively useless notices, which reduces the amount of predicates executed.",
        default: false,
        restartNeeded: true
    }
});

export default definePlugin({
    name: "Unbloater",
    description: "Remove bad and useless Discord code to improve performance.",
    authors: [Devs.Nuckyz],

    settings,

    patches: [
        {
            find: "window.Firebug",
            replacement: {
                match: /setInterval\(\(function\(\){return \i\.check\(\)}\),500\);/,
                replace: ""
            },
        },
        {
            find: 'displayName="NoticeStore"',
            predicate: () => settings.store.filterNoticeStorePredicates,
            replacement: {
                match: /(\[\i\.\i\.QUARANTINED.+?(?<!\)|\})\])/g,
                replace: "$&.filter(type=>!$self.IGNORED_NOTICES_PREDICATES.includes(type))"
            }
        }
    ],

    settingsAboutComponent: () => (
        <React.Fragment>
            <Forms.FormTitle tag="h3">Removed Notices:</Forms.FormTitle>
            <Forms.FormText variant="text-md/normal">{IGNORED_NOTICES_PREDICATES.join(", ")}</Forms.FormText>
        </React.Fragment>
    ),

    IGNORED_NOTICES_PREDICATES
});
