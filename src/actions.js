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

import { createAction } from "openstack-uicore-foundation/lib/utils/actions";

export const START_WIDGET_LOADING           = 'START_WIDGET_LOADING';
export const STOP_WIDGET_LOADING            = 'STOP_WIDGET_LOADING';
export const LOAD_INITIAL_VARS              = 'LOAD_INITIAL_VARS';
export const UPDATE_CLOCK                   = 'UPDATE_CLOCK';
export const SET_VIEW                       = 'SET_VIEW';
export const SET_TIMEZONE                   = 'SET_TIMEZONE';
export const ADDED_TO_SCHEDULE              = 'ADDED_TO_SCHEDULE';
export const REMOVED_FROM_SCHEDULE          = 'REMOVED_FROM_SCHEDULE';
export const UPDATE_EVENTS                  = 'UPDATE_EVENTS';
export const UPDATE_SETTINGS                = 'UPDATE_SETTINGS';


const startWidgetLoading = () => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}));
};

const stopWidgetLoading = () => (dispatch) => {
    dispatch(createAction(STOP_WIDGET_LOADING)({}));
};

export const loadSettings = (settings) => (dispatch) => {
    dispatch(startWidgetLoading());

    dispatch(createAction(LOAD_INITIAL_VARS)(settings));

    // apply marketing styles
    Object.entries(settings.marketingSettings).forEach(([key, value]) => {
        if (getComputedStyle(document.documentElement).getPropertyValue(`--${key}`)) {
            document.documentElement.style.setProperty(`--${key}`, value);
            document.documentElement.style.setProperty(`--${key}50`, `${value}50`);
        }
    });

    dispatch(stopWidgetLoading());

    return Promise.resolve();
};

export const updateClock = (timestamp) => (dispatch) => {
    dispatch(createAction(UPDATE_CLOCK)({timestamp}));
};


export const updateEvents = (events) => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}));
    dispatch(createAction(UPDATE_EVENTS)({events}));
};

export const updateSettings = (newSettings) => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}));
    dispatch(createAction(UPDATE_SETTINGS)(newSettings));
};

/*********************************************************************************/
/*                               VIEWS                                           */
/*********************************************************************************/

export const changeView = (view) => (dispatch, getState) => {
    const { settings: { triggerAction } } = getState();
    dispatch(createAction(SET_VIEW)({ view }));

    return triggerAction('CHANGE_VIEW', {view});
};

export const changeTimezone = (timezone) => (dispatch, getState) => {
    const { settings: { triggerAction } } = getState();
    dispatch(createAction(SET_TIMEZONE)({ timezone }));

    return triggerAction('CHANGE_TIMEZONE', {timezone});
}


/*********************************************************************************/
/*                               USER ACTIONS                                    */
/*********************************************************************************/


export const addEventToSchedule = (event) => (dispatch, getState) => {
    const { settings: { triggerAction } } = getState();

    dispatch(startWidgetLoading());

    return triggerAction(ADDED_TO_SCHEDULE, {event})
        .then((event) => {
            dispatch(createAction(ADDED_TO_SCHEDULE)({event}));
            dispatch(stopWidgetLoading());
        })
        .catch(res => {
            dispatch(defaultErrorHandler(res));
        });
};

export const removeEventFromSchedule = (event, cb) => (dispatch, getState) =>  {
    const { settings: { triggerAction } } = getState();

    dispatch(startWidgetLoading());

    triggerAction(REMOVED_FROM_SCHEDULE, {event})
        .then((event) => {
            dispatch(createAction(REMOVED_FROM_SCHEDULE)({event}));
            dispatch(stopWidgetLoading());
        })
        .catch(res => {
            dispatch(defaultErrorHandler(res));
        });
};


/*********************************************************************************/
/*                               ERROR HANDLERS                                  */
/*********************************************************************************/


const defaultErrorHandler = (err, res) => (dispatch, state) => {
    dispatch(stopWidgetLoading());
    console.log(res);
};

