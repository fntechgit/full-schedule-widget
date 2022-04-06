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

import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from "react-tooltip";
import SpeakerInfo from "../../speaker-info";

import styles from './index.module.scss'
import styles2 from '../../../styles/general.module.scss';

const Speakers = ({event, withPic, onChat, onEmail, className, showSendEmail}) => {

    // we need all this code to hide tooltip when you scroll page while mouse is over tooptip bug
    useEffect(() => {
        const onScroll = e => {
            const tooltips = document.getElementsByClassName(tooltip);
            Array.from(tooltips).forEach(tp => tp.classList.remove('show'));
        };
        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    })

    const getHosts = () => {
        let hosts = [];
        if (event.speakers?.length > 0) {
            hosts = [...event.speakers];
        }
        if (event.moderator) hosts.push(event.moderator);

        return hosts;
    };

    const getSpeakersWithPic = () => {
        return getHosts().map((sp, i) => (
            <React.Fragment key={`ev-${event.id}-speaker-${sp.id}-${i}`}>
                <div className={styles.speaker} data-tip="" data-for={`speakerInfo-${sp.id}`}>
                    <div className={styles.picWrapper}>
                        <div className={styles.pic} style={{backgroundImage: `url(${sp.pic})`}} />
                    </div>
                    <div className={styles.nameWrapper}>
                        <div className={styles.name}>
                            {sp.first_name} {sp.last_name}
                        </div>
                        {sp.title &&
                        <div className={styles.job}>
                            <span>{sp.title}</span>
                            {sp.company && <span className={styles.company}> - {sp.company}</span>}
                        </div>
                        }
                    </div>
                </div>
                <ReactTooltip
                    className={styles2.tooltip}
                    delayShow={200}
                    id={`speakerInfo-${sp.id}`}
                    type='light'
                    place="right"
                    clickable={true}
                >
                   <SpeakerInfo speaker={sp} onChat={onChat} onEmail={onEmail} showSendEmail={showSendEmail} />
                </ReactTooltip>
            </ React.Fragment>
        ));
    };

    const getSpeakers = () => {
      const speakerTags = getHosts().map((sp, i) => {
          const spkrName = <>{sp.first_name} {sp.last_name} {sp.company ? <span className={styles.company}> - {sp.company}</span> : ''}</>;
          return <span className={styles.name} key={`spkr-${sp.id}-${i}`}>{i === 0 ? spkrName : <>, {spkrName}</> }</span>;
      });

      if (speakerTags.length > 0) {
          return (
              <div className={styles.speakerNames}>
                  {`By `} {speakerTags}
              </div>
          );
      }

      return null;
    };

    return (
        <div className={`${styles.wrapper} ${withPic ? styles.withPic : styles.noPic} ${className}`}>
            {withPic ? getSpeakersWithPic() : getSpeakers()}
        </div>
    );
};

Speakers.propTypes = {
    event: PropTypes.object.isRequired,
    withPic: PropTypes.bool,
    onChat: PropTypes.func.isRequired,
    onEmail: PropTypes.func.isRequired,
    className: PropTypes.string
};

Speakers.defaultProps = {
    withPic: false,
    className: ''
};

export default Speakers
