import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const Event = ({ event, onEventClick }) => {
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
        <p className={styles.title}>{event.title}</p>
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
