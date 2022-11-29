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

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Event from './event-card/event';
import {addEventToSchedule, removeEventFromSchedule} from "../actions";

import styles from '../styles/general.module.scss';


const EventList = ({
    events,
    settings,
    summit,
    loggedUser,
    addEventToSchedule,
    removeEventFromSchedule
}) => {
    return (
        <div className={styles.eventList}>
            {events.length === 0 &&
            <div className={styles.noEvents}>There are no activities to display.</div>
            }
            {events.map(event => (
                <Event
                    key={`event-${event.id}`}
                    event={event}
                    settings={settings}
                    summit={summit}
                    loggedUser={loggedUser}
                    onAddEvent={addEventToSchedule}
                    onRemoveEvent={removeEventFromSchedule}
                />
            ))}
        </div>
    )
}

EventList.propTypes = {
    events: PropTypes.array.isRequired,
    summit: PropTypes.object.isRequired,
};

function mapStateToProps(scheduleState) {
    return {
        ...scheduleState
    }
}

export default connect(mapStateToProps, {
    addEventToSchedule,
    removeEventFromSchedule,
})(EventList)

