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

import React, { useState } from 'react';
import { useLayer } from 'react-laag';
import EventCountdown from '../countdown';
import Speakers from '../event-card/speakers';
import RawHTML from 'openstack-uicore-foundation/lib/components/raw-html';
import CircleButton from 'openstack-uicore-foundation/lib/components/circle-button';

import { getLocation } from '../../tools/utils';

import generalStyles from '../../styles/general.module.scss';
import styles from './index.module.scss';

const { circleButton, link } = generalStyles;

const EventInfo = React.forwardRef(({
    event,
    summit,
    nowUtc,
    onEventClick,
    addToSchedule,
    removeFromSchedule,
    onClose,
    needsLogin,
    loggedUser,
    onEmail,
    onChat,
    showSendEmail,
    summitVenueCount
}, ref) => {
    if (!event) return null;

    const eventDate = event.startTimeAtTimezone.format('ddd, MMMM D');
    const eventStartTime = event.startTimeAtTimezone.format('h:mma');
    const eventEndTime = event.endTimeAtTimezone.format('h:mma');
    const locationStr = getLocation(event, summit.start_showing_venues_date, summitVenueCount, nowUtc);

    const getTitleTag = () => {
        const handleClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            onEventClick(event);
        };

        if (onEventClick) {
            return <a className={link} href="#;" onClick={handleClick}>{event.title}</a>
        } else {
            return event.title;
        }
    };

    const goToEvent = () => {
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const handleAddEvent = (event) => {
        if (loggedUser) {
            addToSchedule(event);
        } else {
            const pendingAction = { action: 'ADD_EVENT', event };
            needsLogin(pendingAction);
        }
    };

    const handleRemoveEvent = (event) => {
        if (loggedUser) {
            removeFromSchedule(event);
        } else {
            const pendingAction = { action: 'REMOVE_EVENT', event };
            needsLogin(pendingAction);
        }
    };

    return (
        <div
            className={styles.outerWrapper}
            id="event-info-popup"
        >
            <div className={styles.innerWrapper}>
                <div className={styles.header}>
                    <div className={styles.countdown}>
                        <EventCountdown event={event} nowUtc={nowUtc} />
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i aria-label='Close' className="fa fa-times" />
                    </button>
                </div>
                <div className={styles.eventInfo}>
                    <div className={styles.locationWrapper}>
                        {`${eventDate}, ${eventStartTime} - ${eventEndTime} | ${locationStr}`}
                    </div>
                    <div className={styles.title}>
                        {getTitleTag()}
                    </div>
                    <div className={styles.track}>
                        <div className={styles.colorBall} style={{ backgroundColor: event.eventColor }} />
                        {event.track.name}
                    </div>
                    <div className={styles.description}>
                        <RawHTML>{event.description}</RawHTML>
                    </div>
                    {event.speakers?.length > 0 &&
                        <div className={styles.speakersWrapper}>
                            <div>Speakers</div>
                            <Speakers
                                event={event}
                                withPic={true}
                                onEmail={onEmail}
                                onChat={onChat}
                                className={styles.speakers}
                                showSendEmail={showSendEmail}
                            />
                        </div>
                    }
                </div>
                <div className={`${styles.circleButton} ${circleButton}`} data-tip={event.isScheduled ? 'added to schedule' : 'Add to my schedule'}>
                    <CircleButton
                        event={event}
                        isScheduled={event.isScheduled}
                        nowUtc={nowUtc}
                        addToSchedule={handleAddEvent}
                        removeFromSchedule={handleRemoveEvent}
                        enterClick={goToEvent}
                    />
                </div>
            </div>
        </div>
    );
});

export default EventInfo;
