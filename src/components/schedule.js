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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventList from '../components/event-list';
import Calendar from './calendar';
import AjaxLoader from 'openstack-uicore-foundation/lib/components/ajaxloader';
import Clock from 'openstack-uicore-foundation/lib/components/clock';
import {
  loadSettings,
  updateClock,
  changeView,
  changeTimezone,
  updateEvents,
  updateSettings,
} from '../actions';
import ButtonBar from './button-bar';
import Modal from './modal';
import { arrayEquals } from '../tools/utils';
import { setGlobalContainer } from 'react-laag';

import 'openstack-uicore-foundation/lib/css/components/circle-button.css';
import styles from '../styles/general.module.scss';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSyncModal: false,
      showShareModal: false,
    };
  }

  componentWillMount() {
    // append popovers container div to body
    this.popoversContainer = document.createElement('div');
    this.popoversContainer.id = 'popovers-container';
    this.popoversContainer.className = styles.popoversContainer;
    document.body.appendChild(this.popoversContainer);
    // set div as global container for popovers lib
    setGlobalContainer(this.popoversContainer);
  }

  componentDidMount() {
    const { updateEventList, loadSettings, changeView, updateClock, ...rest } =
      this.props;

    loadSettings(rest);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      events: prevEvents,
      shareLink: prevShareLink,
      view: prevView,
      timezone: prevTimezone,
    } = prevProps;
    const { events, updateEvents, shareLink, view, updateSettings, timezone } =
      this.props;

    const eventsChanged = !arrayEquals(prevEvents, events);

    if (
      shareLink !== prevShareLink ||
      view !== prevView ||
      timezone !== prevTimezone
    ) {
      updateSettings({ shareLink, view, timezone });
    }

    if (eventsChanged || timezone !== prevTimezone) {
      updateEvents(events);
    }
  }

  componentWillUnmount() {
    // remove popovers container div from body
    document.body.removeChild(this.popoversContainer);
  }

  toggleSyncModal = (show) => {
    const { settings, loggedUser } = this.props;

    if (loggedUser) {
      this.setState({ showSyncModal: show });
    } else {
      settings.needsLogin();
    }
  };

  toggleShareModal = (show) => {
    const { shareLink } = this.props.settings;
    this.setState({ showShareModal: show, shareLink });
  };

  render() {
    const {
      summitState,
      settings,
      widgetLoading,
      updateClock,
      changeView,
      changeTimezone,
      loggedUser,
      summitLogoPrint
    } = this.props;
    const { time_zone_id: timeZoneId, time_zone_label: summitTimezoneLabel } =
      summitState || {};
    const { showSyncModal, showShareModal, shareLink } = this.state;
    const Events = settings.view === 'list' ? EventList : Calendar;

    // we use this to know when data is fully loaded
    if (!summitState) return null;

    return (
      <div className={`${styles.outerWrapper} full-schedule-widget`}>
        <AjaxLoader show={widgetLoading} size={60} relative />
        <div className={styles.header}>
          <div className={`${styles.title} widget-title`}>{settings.title}</div>
          {settings.subtitle && <div className={`${styles.subtitle} widget-subtitle`}>{settings.subtitle}</div>}
          <ButtonBar
            currentHour={settings.currentHour}
            view={settings.view}
            timezone={settings.timezone}
            summitTimezoneLabel={summitTimezoneLabel}
            onChangeView={changeView}
            onChangeTimezone={changeTimezone}
            onSync={() => this.toggleSyncModal(true)}
            onShare={() => this.toggleShareModal(true)}
            showSync={settings.showSync}
            showPrint={settings.showPrint}
            summitLogoPrint={summitLogoPrint}
          />
        </div>
        <div className={styles.innerWrapper}>
          <Events />
        </div>
        <Clock
          onTick={updateClock}
          timezone={timeZoneId}
          now={settings.nowUtc}
        />
        <Modal
          onHide={() => this.toggleSyncModal(false)}
          show={showSyncModal}
          title={settings.modalSyncTitle}
          text={settings.modalSyncText}
          link={loggedUser?.schedule_shareable_link}
        />
        <Modal
          onHide={() => this.toggleShareModal(false)}
          show={showShareModal}
          title='Sharable link to this schedule view'
          text='Anyone with this link will see the current filtered schedule view'
          link={shareLink}
        />
      </div>
    );
  }
}

Schedule.propTypes = {
  summitLogoPrint: PropTypes.string,
};

Schedule.defaultProps = {
  summitLogoPrint: false,  
};

function mapStateToProps(scheduleReducer) {
  return {
    settings: scheduleReducer.settings,
    summitState: scheduleReducer.summit,
    widgetLoading: scheduleReducer.widgetLoading,
    loggedUser: scheduleReducer.loggedUser,
  };
}

export default connect(mapStateToProps, {
  loadSettings,
  updateClock,
  changeView,
  changeTimezone,
  updateEvents,
  updateSettings,
})(Schedule);
