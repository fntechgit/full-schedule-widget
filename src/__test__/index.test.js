/**
 * @jest-environment jsdom
 */
import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FullSchedule from '../full-schedule';
import EventsData from "../dummy_data/events.json";
import SummitData from "../dummy_data/summit.json";
import marketingSettings from "../dummy_data/marketing-data.json";

Enzyme.configure({adapter: new Adapter()});

describe("FullSchedule", () => {
    it('render', () => {

        const scheduleProps = {
            events: EventsData,
            summit: SummitData,
            marketingSettings: marketingSettings.colors,
            userProfile: null,
            colorSource: 'track',
            view: 'calendar',
            timezone: 'show',
            now: null,
            title: 'Custom Schedule',
            withThumbs: false,
            defaultImage:
                'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
            onEventClick: console.log,
            onStartChat: console.log,
            showSendEmail: true,
            shareLink: 'santi.com/share',
            needsLogin: pendingEvent => console.log('login needed', pendingEvent),
            triggerAction: (action, payload) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('loading...', action, payload);
                        resolve(payload);
                    }, 500);
                }),
        };

        const component = mount(<FullSchedule  {...scheduleProps} />);

        expect(component.length).toEqual(1);
    })
});
