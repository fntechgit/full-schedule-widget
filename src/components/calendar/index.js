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

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLayer, useMousePositionAsTrigger } from 'react-laag';
import EventInfo from '../event-info';
import Day from './day';
import { addEventToSchedule, removeEventFromSchedule } from '../../actions';
import { getEventsByDayAndHour } from '../../tools/utils';

import styles from '../../styles/general.module.scss';

const Calendar = ({
  events,
  settings,
  summit,
  addEventToSchedule,
  removeEventFromSchedule,
  loggedUser,
}) => {
  const [eventDetails, setEventDetails] = useState(null);
  const groupedEvents = getEventsByDayAndHour(events, summit);
  const filteredGroupedEvents = groupedEvents.filter((d) => d.hours.length);

  const {
    hasMousePosition,
    handleMouseEvent,
    resetMousePosition,
    trigger,
    parentRef
  } = useMousePositionAsTrigger();

  const {
    layerProps,
    renderLayer
  } = useLayer({
    isOpen: hasMousePosition,
    auto: true,
    onOutsideClick: resetMousePosition,
    trigger
  });

  useEffect(() => {
    const closeEventInfo = (ev) => {
      if (!isMobile) {    
        const wrapper = document.getElementById('event-info-popup');
        if (wrapper && !wrapper.contains(ev.target.parentNode)) {
          setEventDetails(null);
        } 
      }
    };

    document.addEventListener('mousedown', closeEventInfo);
    return () => {
      document.removeEventListener('mousedown', closeEventInfo);
    };
  }, []);

  // close event detail info if event removed
  useEffect(() => {
    if (eventDetails) {
      const scheduleHasEvent = events.find(ev => ev.id === eventDetails.id);
      if (!scheduleHasEvent) {
        setEventDetails(null);
      }
    }
  }, [events?.length])

  const onEventClick = (ev, event) => {
    handleMouseEvent(ev);
    setEventDetails(event);
  };

  const onEventInfoClose = () => {
    resetMousePosition();
    setEventDetails(null);
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
    onEmail: onSendEmail,
  };

  return (
    <div ref={parentRef} className={styles.eventList}>
      {filteredGroupedEvents.length === 0 && (
        <div className={styles.noEvents}>
          There are no activities to display.
        </div>
      )}
      {filteredGroupedEvents.map((date) => (
        <Day
          {...date}
          settings={settings}
          onEventClick={onEventClick}
          key={`cal-day-${date.dateString}`}
        />
      ))}
      { hasMousePosition && renderLayer(
        <div
          className={styles.eventInfoLayer}
          {...layerProps}
        >
          <EventInfo
            event={eventDetails}
            {...eventInfoProps}
            onClose={() => onEventInfoClose()}
          />
        </div>
      )}
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.array.isRequired,
  summit: PropTypes.object.isRequired,
};

function mapStateToProps(scheduleState) {
  return {
    ...scheduleState,
  };
}

export default connect(mapStateToProps, {
  addEventToSchedule,
  removeEventFromSchedule,
})(Calendar);
