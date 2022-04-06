/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import { epochToMoment } from "openstack-uicore-foundation/lib/utils/methods";
import FragmentParser from "openstack-uicore-foundation/lib/utils/fragment-parser";

import moment from "moment-timezone";

const fragmentParser = new FragmentParser();

export const isLive = (event, nowUtc) => {
    const hasEnded = event.end_date < nowUtc;
    const hasStarted = event.start_date < nowUtc;
    return hasStarted && !hasEnded;
};

export const minutesToStart = (event, nowUtc) => {
    const momentNow = epochToMoment(nowUtc);
    const momentStart = epochToMoment(event.start_date);
    const duration = moment.duration(momentStart.diff(momentNow)).asMinutes();
    return duration > 1 ? Math.ceil(duration) : 1;
};

export const getNowFromQS = (timezone) => {
    const nowQS = fragmentParser.getParam('now');
    const momentQS = moment.tz(nowQS, 'YYYY-MM-DD,hh:mm:ss', timezone);
    return momentQS.isValid() ? momentQS.valueOf() / 1000 : null;
};

export const getLocation = (event, summit, nowUtc) => {
    const shouldShowVenues = (summit.start_showing_venues_date * 1000) < nowUtc;
    let locationName = '';
    const { location } = event;

    if (!shouldShowVenues) return 'TBA';

    if (!location) return 'TBA';

    if (location.venue && location.venue.name)
        locationName = location.venue.name;
    if (location.floor && location.floor.name)
        locationName = `${locationName} - ${location.floor.name}`;
    if (location.name)
        locationName = `${locationName} - ${location.name}`;

    return locationName || 'TBA';
};