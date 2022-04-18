import React from 'react';
import PropTypes from 'prop-types';
import Hour from '../hour';

import styles from './index.module.scss';

const fallsWithinTheTimeBlock = (startTime, endTime, timeToCheck) =>
  startTime <= timeToCheck && timeToCheck <= endTime;

const Day = ({ dateString, dateStringDay, hours, nowUtc, onEventClick }) => (
  <div className={styles.wrapper}>
    <div className={styles.dayLabel}>
      <span className={styles.day}>{dateStringDay}</span>, {dateString}
    </div>

    <div>
      {hours.map((hour) => {
        const endTimeOfLastEvent =
          hour.events[hour.events.length - 1].endTimeAtTimezone._i / 1000;

        const lastItem = index === hours.length - 1;
        const justStarted = lastItem
          ? fallsWithinTheTimeBlock(hour.hour, endTimeOfLastEvent, nowUtc)
          : fallsWithinTheTimeBlock(hour.hour, hours[index + 1].hour, nowUtc);

        return (
          <Hour
            {...hour}
            justStarted={justStarted}
            nowUtc={nowUtc}
            onEventClick={onEventClick}
            key={`cal-hr-${hour.hour}`}
          />
        );
      })}
    </div>
  </div>
);

Day.propTypes = {
  dateString: PropTypes.string.isRequired,
  dateStringDay: PropTypes.string.isRequired,
  hours: PropTypes.array.isRequired,
};

export default Day;
