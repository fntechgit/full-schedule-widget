/**
 * Copyright 2017 OpenStack Foundation
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
import ReactDOM from 'react-dom';
import Schedule from './full-schedule';

import EventsData from './dummy_data/events.json';
import SummitData from './dummy_data/summit.json';
import marketingSettings from './dummy_data/marketing-data.json'

const scheduleProps = {
    events: EventsData,
    summit: SummitData.summit,
    marketingSettings: marketingSettings.colors,
    userProfile: null,
    colorSource: 'track',
    view: 'calendar',
    timezone: 'show',
    now: null,
    title: 'Custom Schedule',
    withThumbs: false,
    defaultImage: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
    onEventClick: console.log,
    onStartChat: console.log,
    showSendEmail: true,
    shareLink: 'santi.com/share',
    needsLogin: (pendingEvent) => console.log('login needed', pendingEvent),
    triggerAction: (action, payload) => new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('loading...', action, payload);
            resolve(payload);
        }, 500)
    })
};


// width 780px or 230px

ReactDOM.render(
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <Schedule {...scheduleProps} />
    </div>,
    document.querySelector('#root')
);
