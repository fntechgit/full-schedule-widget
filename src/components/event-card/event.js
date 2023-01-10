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

import React, {
    useRef,
    useState,
    useEffect
} from 'react';
import PropTypes from 'prop-types';
import EventHeader from './header';
import EventCountdown from "../countdown";
import CircleButton from "openstack-uicore-foundation/lib/components/circle-button";

import {
  useIsMobileScreen
} from '../../tools/utils';

import styles from './event.module.scss'
import styles2 from "../../styles/general.module.scss";

const Event = ({
    event,
    summit,
    loggedUser,
    onAddEvent,
    onRemoveEvent,
    settings
}) => {
    const ref = useRef(null);

    const [showDetailsButton, setShowDetailsButton] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const isMobile = useIsMobileScreen();

    useEffect(() => {
        const handleTouchOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowDetailsButton(false);
            }
        };
        document.addEventListener('touchstart', handleTouchOutside, true);
        return () => {
            document.removeEventListener('touchstart', handleTouchOutside, true);
        };
    }, []);

    const handleEvent = (e) => {
        switch (e.type) {
        case 'mouseenter':
        case 'touchstart':
            setShowDetailsButton(true);
            break;
        case 'mouseleave':
            setShowDetailsButton(false);
            break;
        default:
            break;
        }
    }

    const addToSchedule = (event) => {
        if (loggedUser) {
            onAddEvent(event);
        } else {
            const pendingAction = { action: 'ADD_EVENT', event}
            settings.needsLogin(pendingAction);
        }
    };

    const removeFromSchedule = (event) => {
        if (loggedUser) {
            onRemoveEvent(event);
        } else {
            const pendingAction = { action: 'REMOVE_EVENT', event}
            settings.needsLogin(pendingAction);
        }
    };

    const sendEmail = (email) => {
        if (window && typeof window !== 'undefined') {
            window.open(`mailto: ${email}`, 'emailWindow');
        }
    };

    const goToEvent = (event) => {
        if (settings.onEventClick) {
            settings.onEventClick(event);
        }
    };

    return (
        <div
            className={styles.wrapper}
            id={`event-${event.id}`}
            style={{ borderLeft: `6px solid ${event.eventColor}` }}
        >
            <div
                className={`${styles.eventCard} ${expanded ? styles.expanded : ''}`}
                ref={ref}
                onMouseEnter={handleEvent}
                onMouseLeave={handleEvent}
                onTouchStart={handleEvent}
            >
                <EventCountdown event={event} nowUtc={settings.nowUtc} className={styles.countdown} />
                <EventHeader
                    event={event}
                    summit={summit}
                    nowUtc={settings.nowUtc}
                    isOpen={expanded}
                    showEventPic={settings.withThumbs}
                    defaultImage={settings.defaultImage}
                    onEventClick={settings.onEventClick}
                    showSendEmail={settings.showSendEmail}
                    sendEmail={sendEmail}
                    startChat={settings.onStartChat}
                />
                { showDetailsButton && 
                <div className={styles.detailsButton}>
                    <button onClick={() => setExpanded(!expanded)} data-tip="More info">
                        <i className={`fa ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                    </button>
                </div>
                }
            </div>
            <div
                className={`${styles.circleButton} ${styles2.circleButton}`}
                data-tip={event.isScheduled ? 'added to schedule' : 'Add to my schedule'}
                onMouseEnter={!isMobile ? handleEvent : () => {}}
                onMouseLeave={!isMobile ? handleEvent : () => {}}
            >
                <CircleButton
                    event={event}
                    isScheduled={event.isScheduled}
                    nowUtc={settings.nowUtc}
                    addToSchedule={addToSchedule}
                    removeFromSchedule={removeFromSchedule}
                    enterClick={goToEvent}
                />
            </div>
        </div>
    );
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
};

export default Event;
