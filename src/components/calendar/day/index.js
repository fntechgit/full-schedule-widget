import React from 'react';
import PropTypes from 'prop-types';
import Hour from '../hour';

import styles from './index.module.scss';
import { Element } from 'react-scroll/modules';

const Day = ({ summitShowLoc, summitVenueCount, settings, dateString, dateStringDay, hours, onEventClick }) => {
  const { nowUtc, currentHour } = settings;

  return (
    <div className={styles.wrapper}>
      <div className={styles.dayLabel}>
        <span className={styles.day}>{dateStringDay}</span>, {dateString}
      </div>

      <div>
        {hours.map((hour, index, hours) =>
          hour.hour === currentHour ? (
            <React.Fragment key={`cal-hr-${hour.hour}`}>
              <Element name='currentHour'>
                <Hour
                  {...hour}
                  summitShowLoc={summitShowLoc}
                  summitVenueCount={summitVenueCount}
                  currentHour={currentHour}
                  nowUtc={nowUtc}
                  onEventClick={onEventClick}
                />
              </Element>
            </React.Fragment>
          ) : (
            <React.Fragment key={`cal-hr-${hour.hour}`}>
              <Hour
                {...hour}
                summitShowLoc={summitShowLoc}
                summitVenueCount={summitVenueCount}
                nowUtc={nowUtc}
                onEventClick={onEventClick}
              />
            </React.Fragment>
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
