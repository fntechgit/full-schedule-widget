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

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import moment from "moment-timezone"
import Day from './day';
import {addEventToSchedule, removeEventFromSchedule} from "../../actions";

import styles from '../../styles/general.module.scss';
import EventInfo from "../event-info";


const Calendar = ({events, settings, summit, addEventToSchedule, removeEventFromSchedule, loggedUser}) => {
    const [eventDetails, setEventDetails] = useState(null);
    const [infoPos, setInfoPos] = useState([0,0]);
    const groupedEvents = [];
    useEffect(() => {
        const closeEventInfo = (ev) => {
            const wrapper = document.getElementById('event-info-popup');
            if (wrapper && !wrapper.contains(ev.target.parentNode)) {
                setEventDetails(null);
            }
        };

        document.addEventListener("mousedown", closeEventInfo);
        return () => {
            document.removeEventListener("mousedown", closeEventInfo);
        };
    }, []);

    summit.dates_with_events.forEach(d => {
        const epochStart = moment.tz(`${d} 00:00:00`, 'YYYY-MM-DD hh:mm:ss', summit.time_zone_id);
        const epochEnd = moment.tz(`${d} 23:59:59`, 'YYYY-MM-DD hh:mm:ss', summit.time_zone_id);
        const offset = moment.tz.zone(summit.time_zone_id).utcOffset(epochStart.valueOf()); // seconds to add to get to utc

        groupedEvents.push({
            dateString: epochStart.format('MMMM D'),
            dateStringDay: epochStart.format('dddd'),
            epochStart: epochStart.utc().valueOf() / 1000,
            epochEnd: epochEnd.utc().valueOf() / 1000,
            timeStart: 24 ,
            timeEnd: 0,
            offset,
            hours: []
        })
    });

    events.reduce((result, event) => {
        const date = result.find(d => event.start_date > d.epochStart && event.start_date < d.epochEnd);
        if (!date) return result;

        const startHour = event.startTimeAtTimezone.unix();
        const hour = date.hours.find(h => h.hour === startHour);

        if (hour) {
            hour.events.push(event);
        } else {
            date.hours.push({hour: startHour, hourLabel: event.startTimeAtTimezone.format('h:mm a'), events: [event]});
        }

        return result;

    }, groupedEvents);

    const filteredGroupedEvents = groupedEvents.filter(d => d.hours.length);

    const onEventClick = (ev, event) => {
        const rect = ev.target.getBoundingClientRect();
        const scroll = window?.scrollY || 0;
        
        // Getting the position relative to the viewport, if it's higher than certain values, it substract an amount 
        // to keep the event info popup inside the viewport.
        const top = rect.top < 150 ? - 250 : rect.top > 750 ? rect.top - 850 : rect.top > 400 ? rect.top - 550 : rect.top - 300;

        setInfoPos([top + scroll, ev.clientX + 30]);
        setEventDetails(event);
    };

    const onSendEmail = (email) => {
        if (window && typeof window !== 'undefined') {
            window.open(`mailto:${email}`, 'emailWindow');
        }
    };

    const eventInfoProps = {
        summit,
        nowUtc: settings.nowUtc,
        onEventClick: settings.onEventClick,
        addToSchedule: addEventToSchedule,
        removeFromSchedule: removeEventFromSchedule,
        needsLogin: settings.needsLogin,
        loggedUser,
        showSendEmail: settings.showSendEmail,
        onChat: settings.onStartChat,
        onEmail: onSendEmail
    };

    return (
        <div className={styles.eventList}>
            {filteredGroupedEvents.length === 0 &&
                <div className={styles.noEvents}>There are no activities to display.</div>
            }
            {filteredGroupedEvents.map(
                date => <Day {...date} nowUtc={settings.nowUtc} onEventClick={onEventClick} key={`cal-day-${date.dateString}`} />
            )}
            <EventInfo
                position={infoPos}
                event={eventDetails}
                {...eventInfoProps}
                onClose={() => { setEventDetails(null)}}
            />
        </div>
    )
};

Calendar.propTypes = {
    events: PropTypes.array.isRequired,
    summit: PropTypes.object.isRequired,
};

function mapStateToProps(scheduleState) {
    return {
        ...scheduleState
    }
};

export default connect(mapStateToProps, {
    addEventToSchedule,
    removeEventFromSchedule,
})(Calendar)

