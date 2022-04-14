import React from 'react';
import PropTypes from 'prop-types';
import Event from '../event';

import styles from './index.module.scss';

const Hour = ({ hourLabel, events, nowUtc, onEventClick }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.timeWrapper}>
        <div className={styles.time}>{hourLabel}</div>
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
  hourLabel: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
};

export default Hour;
