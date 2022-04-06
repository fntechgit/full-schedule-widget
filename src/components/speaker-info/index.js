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
import RawHTML from 'openstack-uicore-foundation/lib/components/raw-html';

import styles from './index.module.scss';

const SpeakerInfo = ({speaker, onChat, onEmail, showSendEmail}) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.picWrapper}>
                    <div className={styles.pic} style={{backgroundImage: `url(${speaker.pic})`}} />
                </div>
                <div className={styles.profileWrapper}>
                    <div className={styles.name}> {speaker.first_name} {speaker.last_name}</div>
                    {speaker.title && <div className={styles.title}>{speaker.title}</div>}
                    {speaker.company && <div className={styles.company}>{speaker.company}</div>}
                    <div className={styles.socialWrapper}>
                        {speaker.twitter &&
                        <div className={styles.social}>
                            <i className="fa fa-twitter" aria-hidden="true" />
                            {decodeURIComponent(speaker.twitter)}
                        </div>
                        }
                        {speaker.irc &&
                        <div className={styles.social}>
                            <i className="fa fa-irc" aria-hidden="true" />
                            {decodeURIComponent(speaker.irc)}
                        </div>
                        }
                    </div>
                    {speaker.badge_features &&
                    <div className={styles.badgeWrapper}>
                        {speaker.badge_features.filter(b => b.image).map(badge => (
                            <div className={styles.badge} key={`sp-${speaker.id}-badge-${badge.id}`}>
                                <img alt={badge.name} src={badge.image} />
                            </div>
                        ))}
                    </div>
                    }
                </div>
            </div>
            <div className={styles.description}>
                {speaker.bio && <RawHTML>{speaker.bio}</RawHTML>}
            </div>
            <div className={styles.actionWrapper}>
                {onChat &&
                <button className={styles.action} onClick={() => onChat(speaker.id)}>
                    <i className="fa fa-comment-o" aria-hidden="true"/>
                    Chat
                </button>
                }
                {showSendEmail && speaker.email && onEmail &&
                <button className={styles.action} onClick={() => onEmail(speaker.email)}>
                    <i className="fa fa-envelope-o" aria-hidden="true"/>
                    E-mail
                </button>
                }
            </div>
        </div>
    );

};

SpeakerInfo.propTypes = {
    speaker: PropTypes.object.isRequired,
};

export default SpeakerInfo;
