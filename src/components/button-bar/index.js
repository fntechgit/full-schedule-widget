import React from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import styles from './index.module.scss';

const ButtonBar = ({
  view,
  timezone,
  summitTimezoneLabel,
  onChangeView,
  onChangeTimezone,
  onSync,
  onShare,
}) => {
  const isLocalTZ = timezone === 'local';
  const timezoneLabel = isLocalTZ ? 'Your Local Timezone' : summitTimezoneLabel;

  return (
    <div className={styles.wrapper}>
      <Button
        role='button'
        tabIndex={0}
        className={`${styles.button} ${styles.timezoneBtn} ${
          isLocalTZ ? 'active' : ''
        }`}
        aria-labelledby='timezone'
        aria-pressed={isLocalTZ}
        onClick={() => onChangeTimezone(isLocalTZ ? 'show' : 'local')}
      >
        <i className='fa fa-clock-o' aria-hidden='true' />
        <span id='timezone'>{timezoneLabel}</span>
      </Button>

      <div className={styles.buttonGroup}>
        <div className={styles.firstGroup}>
          <Button onClick={onSync} className={`${styles.button} ${styles.cal}`}>
            <i className='fa fa-refresh' aria-hidden='true' />
            Calendar Sync
          </Button>

          <Button
            onClick={onShare}
            className={`${styles.button} ${styles.share}`}
          >
            <i className='fa fa-share' aria-hidden='true' />
            Share
          </Button>
        </div>

        <div className={styles.divider} />

        <div className={styles.secondGroup}>
          <ToggleButtonGroup
            aria-label='Schedule view'
            name='view'
            onChange={onChangeView}
            role='group'
            type='radio'
            value={view}
          >
            <ToggleButton
              aria-pressed={view === 'calendar'}
              className={`${styles.button} ${view === 'calendar' && 'active'}`}
              id='view-calendar'
              role='button'
              tabIndex={0}
              value='calendar'
            >
              <i className='fa fa-calendar-o' aria-hidden='true' />
              Calendar
            </ToggleButton>

            <ToggleButton
              aria-pressed={view === 'list'}
              className={`${styles.button} ${view === 'list' && 'active'}`}
              id='view-list'
              role='button'
              tabIndex={0}
              value='list'
            >
              <i className='fa fa-list' aria-hidden='true' />
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ButtonBar;
