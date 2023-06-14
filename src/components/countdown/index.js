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
import {isLive, minutesToStart} from "../../tools/utils";

import styles from './index.module.scss';

const EventCountdown = ({event, nowUtc, className = ''}) => {
    const minutes = minutesToStart(event, nowUtc);
    const isLiveNow = isLive(event, nowUtc);
    const id = isLiveNow ? {id: 'currentHour'} : {};

    if (event.end_date < nowUtc || minutes > 15) return null;

    return (
        <div {...id} className={`${styles.countdown} ${isLiveNow ? styles.live : styles.starting} ${className}`}>
            <i className={`fa ${isLiveNow ? 'fa-podcast' : 'fa-clock-o' }`} aria-hidden="true" />
            <span className={styles.label}>
                {isLiveNow ? 'Live now' : `Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`}
            </span>
        </div>
    );

};

EventCountdown.propTypes = {
    event: PropTypes.object.isRequired,
    nowUtc: PropTypes.number.isRequired
};

export default EventCountdown;
