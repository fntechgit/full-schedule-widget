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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EventHeader from './header';
import EventCountdown from "../countdown";
import CircleButton from "openstack-uicore-foundation/lib/components/circle-button";


import styles from './event.module.scss'
import styles2 from "../../styles/general.module.scss";

class Event extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            showDetailsButton: false
        }
    }

    addToSchedule = (event) => {
        const {loggedUser, settings} = this.props;

        if (loggedUser) {
            this.props.onAddEvent(event);
        } else {
            settings.needsLogin();
        }
    };

    removeFromSchedule = (event) => {
        const {loggedUser, settings} = this.props;

        if (loggedUser) {
            this.props.onRemoveEvent(event);
        } else {
            settings.needsLogin();
        }
    };

    sendEmail = (email) => {
        if (window && typeof window !== 'undefined') {
            window.open(`mailto: ${email}`, 'emailWindow');
        }
    };

    goToEvent = (event) => {
        const {settings} = this.props;

        if (settings.onEventClick) {
            settings.onEventClick(event);
        }
    };

    render() {
        const { event, summit, settings } = this.props;
        const { expanded, showDetailsButton } = this.state;
        return (
            <div
                className={`${styles.wrapper} ${expanded && styles.expanded} event-wrapper`}
                id={`event-${event.id}`}
                style={{ borderLeft: `6px solid ${event.eventColor}` }}
                onMouseEnter={() => this.setState({showDetailsButton: true})}
                onMouseLeave={() => this.setState({showDetailsButton: false})}
            >
                <EventCountdown event={event} nowUtc={settings.nowUtc} className={styles.countdown} />
                <div className={`${styles.circleButton} ${styles2.circleButton}`} data-tip={event.isScheduled ? 'added to schedule' : 'Add to my schedule'}>
                    <CircleButton
                        event={event}
                        isScheduled={event.isScheduled}
                        nowUtc={settings.nowUtc}
                        addToSchedule={this.addToSchedule}
                        removeFromSchedule={this.removeFromSchedule}
                        enterClick={this.goToEvent}
                    />
                </div>
                <EventHeader
                    event={event}
                    summit={summit}
                    nowUtc={settings.nowUtc}
                    isOpen={expanded}
                    showEventPic={settings.withThumbs}
                    defaultImage={settings.defaultImage}
                    onEventClick={settings.onEventClick}
                    showSendEmail={settings.showSendEmail}
                    sendEmail={this.sendEmail}
                    startChat={settings.onStartChat}
                />
                <div className={`${styles.detailsButton} ${showDetailsButton && styles.show}`}>
                    <button onClick={() => {this.setState({expanded: !expanded})}} data-tip="More info" className="open-info-btn">
                        <i className={`fa ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                    </button>
                </div>
            </div>
        )
    }
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
};

export default Event;
