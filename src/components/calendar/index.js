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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Day from './day';
import { addEventToSchedule, removeEventFromSchedule } from '../../actions';

import styles from '../../styles/general.module.scss';
import EventInfo from '../event-info';
import { useIsMobileScreen, getEventsByDayAndHour } from '../../tools/utils';

const Calendar = ({
  events,
  settings,
  summit,
  addEventToSchedule,
  removeEventFromSchedule,
  loggedUser,
}) => {
  const isMobile = useIsMobileScreen();
  // const [bodyScrollY, setBodyScrollY] = useState(null);
  // const [bodyStyleCSS, setBodyStyleCSS] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [infoPos, setInfoPos] = useState([0, 0]);
  const groupedEvents = getEventsByDayAndHour(events, summit);
  const filteredGroupedEvents = groupedEvents.filter((d) => d.hours.length);

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
    const scroll = window?.scrollY || 0;

    setInfoPos([ev.clientY + scroll, ev.clientX + 30]);
    setEventDetails(event);
    // on mobile need to prevent page scrolling when popup open
    // commenting out, this breaks event info popup on safari mobile
    // https://tipit.avaza.com/project/view#!tab=task-pane&groupby=MyTaskProject&view=vertical&task=3016013&fileview=grid
    // if (isMobile) {
    //   // store current body scroll value
    //   setBodyScrollY(scroll);
    //   const style = { position: 'fixed', overflow: 'hidden', height: '100%', width: '100%', top: `-${scroll}px`};
    //   const styleCss = Object.entries(style).map(([k, v]) => `${k}: ${v}`).join(';');
    //   setBodyStyleCSS(styleCss);
    // }
  };

  const onEventInfoClose = () => {
    // if (isMobile) {
    //   setBodyStyleCSS(null);
    //   // scroll behavior value should be 'instant'
    //   // there is a current iOS Safari bug causing animation to brake
    //   // scrolling with default animation
    //   window.scrollTo({ top: bodyScrollY });
    // }
    setEventDetails(null);
  };

  const adjustPopupPosition = (popUpHeight) => {
    const scroll = window?.scrollY || 0;
    const top = infoPos[0] - scroll;

    // if the current popup is outside of the viewport, changes the position
    // adding 75 pixels as margin
    if (top + popUpHeight + 75 > window.innerHeight) {
      // If the popup is bigger and top position is out of viewport, reduce the top value to a quarter instead of setting top position at bottom of the popup
      if(top - popUpHeight < 0 ) {
        setInfoPos([top - (popUpHeight/4) + scroll, infoPos[1]])
      } else {
        setInfoPos([top - popUpHeight + scroll, infoPos[1]])
      }
    }    
  }

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
    <div className={styles.eventList}>
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
      <EventInfo
        position={infoPos}
        event={eventDetails}
        {...eventInfoProps}
        getPopUpHeight={adjustPopupPosition}
        onClose={() => onEventInfoClose()}
      />
      { /* bodyStyleCSS && <style dangerouslySetInnerHTML={{ __html: `body { ${bodyStyleCSS} }` }} /> */}
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
