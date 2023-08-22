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

import {useEffect, useState} from 'react';
import {epochToMoment} from 'openstack-uicore-foundation/lib/utils/methods';
import FragmentParser from 'openstack-uicore-foundation/lib/utils/fragment-parser';
import moment from 'moment-timezone';

const MEDIUM_DEVICE_SCREEN_WIDTH = 768;

const fragmentParser = new FragmentParser();

export const useIsMobileScreen = () => {
  const [width, setWidth] = useState(window?.innerWidth);
  const handleWindowSizeChange = () => setWidth(window?.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);
  return (width < MEDIUM_DEVICE_SCREEN_WIDTH);
};

export const isLive = (event, nowUtc) => {
  const hasEnded = event.endTimeAtTimezone._i / 1000 < nowUtc;
  const hasStarted = event.startTimeAtTimezone._i / 1000 < nowUtc;
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

export const getLocation = (event, summitShowLocDate, summitVenueCount, nowUtc) => {
  const shouldShowVenues = summitShowLocDate ? summitShowLocDate * 1000 < nowUtc : true;
  const locationName = [];
  const {location} = event;

  if (!shouldShowVenues) return 'TBA';

  if (!location) return 'TBA';

  if (summitVenueCount > 1 && location.venue?.name) locationName.push(location.venue.name);
  if (location.floor?.name) locationName.push(location.floor.name);
  if (location.name) locationName.push(location.name);

  return locationName.length > 0 ? locationName.join(' - ') : 'TBA';
};

export const getHosts = (event) => {
  let hosts = [];
  if (event.speakers?.length > 0) {
    hosts = [...event.speakers];
  }
  if (event.moderator) hosts.push(event.moderator);

  return hosts;
};

export const fallsWithinTheTimeBlock = (startTime, endTime, timeToCheck) =>
  startTime <= timeToCheck && timeToCheck < endTime;

export const getDatesFromSummit = (summit) => {
  if (!summit) return;

  return summit.dates_with_events.map((date) => {
    const epochStart = moment.tz(
      `${date} 00:00:00`,
      'YYYY-MM-DD hh:mm:ss',
      summit.time_zone_id
    );
    const epochEnd = moment.tz(
      `${date} 23:59:59`,
      'YYYY-MM-DD hh:mm:ss',
      summit.time_zone_id
    );
    const offset = moment.tz
      .zone(summit.time_zone_id)
      .utcOffset(epochStart.valueOf()); // seconds to add to get to utc

    return {
      dateString: epochStart.format('MMMM D'),
      dateStringDay: epochStart.format('dddd'),
      epochStart: epochStart.utc().valueOf() / 1000,
      epochEnd: epochEnd.utc().valueOf() / 1000,
      timeStart: 24,
      timeEnd: 0,
      offset,
      hours: [],
    };
  });
};

export const getEventsByDayAndHour = (events, summit) => {
  const dates = getDatesFromSummit(summit);

  if (!dates) return;

  return events.reduce((prev, event) => {
    const date = prev.find(
      (d) => event.start_date > d.epochStart && event.start_date < d.epochEnd
    );

    if (!date) return prev;

    const startHour = event.startTimeAtTimezone.unix();
    const hour = date.hours.find((h) => h.hour === startHour);

    if (hour) {
      hour.events.push(event);
    } else {
      date.hours.push({
        hour: startHour,
        hourLabel: event.startTimeAtTimezone.format('h:mm a'),
        events: [event],
      });
    }

    return prev;
  }, dates);
};

export const getCurrentHourFromEvents = (events, summit, nowUtc) => {

  const hours = getEventsByDayAndHour(events, summit)
    .map((event) => event.hours)
    .flat();

  let currentHour = null;

  if (hours.length > 0) {
    // find first hour that follows nowUtc
    const nextHourIdx = hours.findIndex(h => h.hour >= nowUtc);

    if (nextHourIdx > 0) {
      currentHour = hours[nextHourIdx - 1];
    } else {
      // check if last hour is still on
      const lastHour = hours[hours.length - 1];
      const ongoingEvent = lastHour.events.find(ev => ev.start_date < nowUtc && ev.end_date > nowUtc);
      if (ongoingEvent) {
        currentHour = lastHour;
      }
    }
  }

  return currentHour;
};

export const arrayEquals = (a, b) => {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => JSON.stringify(val) === JSON.stringify(b[index]));
}


/*************** SVG TO PNG for print version *****************************************/

const loadImage = async url => {
  const img = document.createElement('img');
  img.src = url;
  img.crossOrigin = 'anonymous';

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = ev => {
      reject(ev);
      return null;
    }
  })
}

export const convertImageToImgData = async (imageUrl) => {
  let response = null;
  try {
    const img = await loadImage(imageUrl);
    if (!img) return null;

    const newWidth = 100;
    const newHeight = Math.floor(img.naturalHeight * 100 / img.naturalWidth);
    const canvas = document.createElement('canvas');

    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.getContext('2d').drawImage(img, 0, 0, newWidth, newHeight);

    const url = await canvas.toDataURL(`image/png`, 1.0);
    response = {url, width: newWidth, height: newHeight};
  } catch (ex) {
    console.log('Error loading summit logo', ex);
  }

  return response;
}
