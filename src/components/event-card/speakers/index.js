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
import {
    useMousePositionAsTrigger,
    useHover,
    useLayer,
    Arrow
} from "react-laag";
import {
  useIsMobileScreen
} from '../../../tools/utils';
import SpeakerInfo from '../../speaker-info';

import styles from './index.module.scss'

const SpeakerPopover = ({
    speaker,
    onChat,
    onEmail,
    showSendEmail
}) => {

    const isMobile = useIsMobileScreen();

    const [
        isOver,
        hoverProps,
        close
    ] = useHover({
        hideOnScroll: !isMobile
    });

    const {
        triggerProps,
        layerProps,
        renderLayer,
        arrowProps
    } = useLayer({
        auto: true,
        isOpen: isOver
    });

    return (
        <div
            {...triggerProps}
            {...hoverProps}
        >
            <div className={styles.speaker}>
                <div className={styles.picWrapper}>
                    <div className={styles.pic} style={{backgroundImage: `url(${speaker.pic})`}} />
                </div>
                <div className={styles.nameWrapper}>
                    <div className={styles.name}>
                        {speaker.first_name} {speaker.last_name}
                    </div>
                    {speaker.title &&
                    <div className={styles.job}>
                        <span>{speaker.title}</span>
                        {speaker.company && <span className={styles.company}> - {speaker.company}</span>}
                    </div>
                    }
                </div>
            </div>
            {isOver && renderLayer(
                <div
                    className={styles.popover}
                    {...layerProps}
                >
                    <div className={styles.header}>
                        <button className={styles.closeButton} onClick={close}>
                            <i aria-label='Close' className="fa fa-times" />
                        </button>
                    </div>
                    <SpeakerInfo
                        speaker={speaker}
                        onChat={onChat}
                        onEmail={onEmail} 
                        howSendEmail={showSendEmail}
                    />
                    <Arrow
                        borderWidth={1}
                        borderColor="rgba(0, 0, 0, 0.175)"
                        {...arrowProps}
                    />
                </div>
            )}
        </div>
    );
}

const Speakers = ({
    event,
    withPic,
    onChat,
    onEmail,
    className,
    showSendEmail
}) => {

    const getHosts = () => {
        let hosts = [];
        if (event.speakers?.length > 0) {
            hosts = [...event.speakers];
        }
        if (event.moderator) hosts.push(event.moderator);

        return hosts;
    };

    const getSpeakersWithPic = () => {
        return getHosts().map((speaker, i) =>
            <SpeakerPopover
                key={`ev-${event.id}-speaker-${speaker.id}-${i}`}
                speaker={speaker}
                onChat={onChat}
                onEmail={onEmail} 
                howSendEmail={showSendEmail}
            />
        );
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
