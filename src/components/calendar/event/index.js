import React from 'react';
import PropTypes from 'prop-types';

import liveNowPill from '../../../images/live-now-pill.svg';
import styles from './index.module.scss';
import { isLive } from '../../../tools/utils';

const Event = ({ event, nowUtc, onEventClick }) => {
  const eventStyles = {
    backgroundColor: event.eventColor,
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
      <span className={styles.speaker}>
        {s.first_name} {s.last_name}
      </span>
    </React.Fragment>
  ));

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
          <p className={styles.title}>{event.title}</p>
        </div>

        {speakers.length > 0 && (
          <p className={styles.speakers}>By {speakers}</p>
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
