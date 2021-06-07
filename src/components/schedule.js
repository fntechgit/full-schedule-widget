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
import {connect} from "react-redux";
import EventList from "../components/event-list";
import Calendar from "./calendar";
import {AjaxLoader, Clock} from 'openstack-uicore-foundation/lib/components';
import {loadSession, updateClock, changeView} from "../actions";
import ButtonBar from './button-bar';
import Modal from './modal';

import styles from "../styles/general.module.scss";
import 'openstack-uicore-foundation/lib/css/components.css';

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSyncModal: false,
            showShareModal: false,
        }
    }

    componentDidMount() {
        const {updateEventList, loadSession, changeView, updateClock, ...rest} = this.props;
        loadSession(rest);
    }

    toggleSyncModal = (show) => {
        const {getSyncLink} = this.props.settings;
        const syncLink = show ? getSyncLink() : '';

      this.setState({showSyncModal: show, syncLink});
    };

    toggleShareModal = (show) => {
        const {getShareLink} = this.props.settings;
        const shareLink = show ? getShareLink() : '';
        this.setState({showShareModal: show, shareLink});
    };

    render() {
        const {summit, changeView, settings, widgetLoading, updateClock, now, events, loggedUser} = this.props;
        const {showSyncModal, showShareModal, syncLink, shareLink} = this.state;
        const Events =  (settings.view === 'list') ? EventList : Calendar;

        return (
            <div className={`${styles.outerWrapper} full-schedule-widget`}>
                <AjaxLoader show={ widgetLoading } size={ 60 } relative />
                {summit &&
                <>
                    <div className={styles.header}>
                        <div className={`${styles.title} widget-title`}>
                            {settings.title}
                        </div>
                        <ButtonBar
                            view={settings.view}
                            onChangeView={changeView}
                            onSync={() => this.toggleSyncModal(true)}
                            onShare={() => this.toggleShareModal(true)}
                        />
                    </div>
                    <div className={styles.innerWrapper}>
                        <Events
                            events={events}
                            summit={summit}
                            loggedUser={loggedUser}
                        />
                    </div>
                    <Clock onTick={updateClock} timezone={summit.time_zone_id} now={now} />
                    <Modal
                        onHide={() => this.toggleSyncModal(false)}
                        show={showSyncModal}
                        title="Calendar Sync"
                        text="Use this link to add to your personal calendar and keep the items you added to your schedule in sync"
                        link={syncLink}
                    />
                    <Modal
                        onHide={() => this.toggleShareModal(false)}
                        show={showShareModal}
                        title="Sharable link to this schedule view"
                        text="Anyone with this link will see the current filtered schedule view"
                        link={shareLink}
                    />
                </>
                }
            </div>
        );
    }
}

function mapStateToProps(scheduleReducer) {
    return {
        ...scheduleReducer
    }
}

export default connect(mapStateToProps, {
    loadSession,
    updateClock,
    changeView
})(Schedule)

