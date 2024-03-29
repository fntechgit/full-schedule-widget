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
import { Fade } from '../../tools/animations';
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
  const [enableLayer, setEnableLayer] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState(false);
  const groupedEvents = getEventsByDayAndHour(events, summit);
  const filteredGroupedEvents = groupedEvents.filter((d) => d.hours.length);
  const venueCount = summit.locations?.filter(loc => loc.class_name === 'SummitVenue')?.length || 0;

  const onEventClick = (ev, event) => {
    handleMouseEvent(ev);
    setEventDetails(event);
    setEnableLayer(true);
    setShowEventInfo(true);
  };

  const onEventInfoClose = () => {
    setShowEventInfo(false);
  };

  const {
    handleMouseEvent,
    trigger,
    parentRef
  } = useMousePositionAsTrigger();

  const {
    layerProps,
    renderLayer
  } = useLayer({
    auto: true,
    isOpen: enableLayer,
    onOutsideClick: onEventInfoClose,
    trigger
  });

  useEffect(() => {
    window.addEventListener('scroll', onEventInfoClose);
    return () => window.removeEventListener('scroll', onEventInfoClose);
  }, []);

  useEffect(() => {
    if (eventDetails && showEventInfo) {
      const event = events.find(ev => ev.id === eventDetails.id);
      if (event) {
        // update event in case it changed
        setEventDetails(event);
      } else {
        onEventInfoClose();
      }
    }
  }, [events?.length, settings.lastDataSync])

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
      { filteredGroupedEvents.length === 0 && (
        <div className={styles.noEvents}>
          There are no activities to display.
        </div>
      )}
      { filteredGroupedEvents.map((date) => (
        <Day
          {...date}
          settings={settings}
          summitShowLoc={summit.start_showing_venues_date}
          summitVenueCount={venueCount}
          onEventClick={onEventClick}
          key={`cal-day-${date.dateString}`}
        />
      ))}
      { enableLayer && renderLayer(
        <div {...layerProps}>
          <Fade
            in={showEventInfo}
            onExited={() => setEnableLayer(false)}
          >
            <EventInfo
              event={eventDetails}
              {...eventInfoProps}
              summitVenueCount={venueCount}
              onClose={() => onEventInfoClose()}
            />
          </Fade>
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
