import React from 'react';
import PropTypes from 'prop-types';
import Hour from '../hour';

import styles from './index.module.scss';
import { Element } from 'react-scroll/modules';

const Day = ({ settings, dateString, dateStringDay, hours, onEventClick }) => {
  const { nowUtc, currentHour } = settings;

  return (
    <div className={styles.wrapper}>
      <div className={styles.dayLabel}>
        <span className={styles.day}>{dateStringDay}</span>, {dateString}
      </div>

      <div>
        {hours.map((hour, index, hours) =>
          hour.hour === currentHour ? (
            <Element name='currentHour'>
              <Hour
                {...hour}
                currentHour={currentHour}
                nowUtc={nowUtc}
                onEventClick={onEventClick}
                key={`cal-hr-${hour.hour}`}
              />
            </Element>
          ) : (
            <Hour
              {...hour}
              nowUtc={nowUtc}
              onEventClick={onEventClick}
              key={`cal-hr-${hour.hour}`}
            />
          )
        )}
      </div>
    </div>
  );
};

Day.propTypes = {
  dateString: PropTypes.string.isRequired,
  dateStringDay: PropTypes.string.isRequired,
  hours: PropTypes.array.isRequired,
};

export default Day;
