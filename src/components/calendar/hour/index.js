import React from 'react';
import PropTypes from 'prop-types';
import Event from '../event';

import styles from './index.module.scss';

const Hour = ({ hourLabel, events, justStarted, nowUtc, onEventClick }) => {
  return (
    <div id={justStarted && styles.liveNow} className={styles.wrapper}>
      <div className={styles.timeWrapper}>
        <div className={styles.time}>{hourLabel}</div>
        {justStarted && <p className={styles.justStartedText}>JUST STARTED</p>}
      </div>

      <div className={styles.eventsWrapper}>
        {events.map((ev, idx) => (
          <Event
            event={ev}
            position={idx}
            nowUtc={nowUtc}
            onEventClick={onEventClick}
            key={`cal-ev-${ev.id}`}
          />
        ))}
      </div>
    </div>
  );
};

Hour.propTypes = {
  events: PropTypes.array.isRequired,
  hourLabel: PropTypes.string.isRequired,
  justStarted: PropTypes.bool.isRequired,
};

export default Hour;
