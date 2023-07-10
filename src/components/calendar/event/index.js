import React from 'react';
import PropTypes from 'prop-types';

import liveNowPill from '../../../images/live-now-pill.svg';
import styles from './index.module.scss';
import { getLocation, isLive } from '../../../tools/utils';

const Event = ({ summitShowLoc, summitVenueCount, event, nowUtc, onEventClick }) => {
  const textColor = event.track.text_color ? {color: event.track.text_color} : {};
  const eventStyles = {
    backgroundColor: event.eventColor,
    ...textColor
  };

  const getHosts = () => {
    let hosts = [];
    if (event.speakers?.length > 0) {
      hosts = [...event.speakers];
    }
    if (event.moderator) hosts.push(event.moderator);

    return hosts;
  };

  const speakers = getHosts().map((s, i) => (
    <React.Fragment key={`ev-${event.id}-spkr-${s.id}`}>
      {i > 0 ? ', ' : ''}
      <span className={styles.speaker} style={textColor}>
        {s.first_name} {s.last_name}
      </span>
    </React.Fragment>
  ));

  const locationStr = getLocation(event, summitShowLoc, summitVenueCount, nowUtc);

  return (
    <div className={styles.outerWrapper}>
      <div
        id={`event-${event.id}`}
        className={`${styles.wrapper} event-wrapper`}
        style={eventStyles}
        onClick={(ev) => onEventClick(ev, event)}
      >
        <div className={styles.eventHeader}>
          {isLive(event, nowUtc) && (
            <img
              className={styles.liveNowIcon}
              src={liveNowPill}
              alt='This event is live now'
            />
          )}
          <p className={styles.title} style={textColor}>{event.title}</p>
        </div>
        {locationStr &&
          <p className={styles.location} style={textColor}>{locationStr}</p>
        }
        {speakers.length > 0 && (
          <p className={styles.speakers} style={textColor}>By {speakers}</p>
        )}
      </div>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired,
  nowUtc: PropTypes.number.isRequired,
};

export default Event;
