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
import { Document, Page, StyleSheet, View, Text, Image } from '@react-pdf/renderer';
import { getHosts, getLocation } from '../tools/utils';
import { epochToMomentTimeZone } from 'openstack-uicore-foundation/lib/utils/methods';

// Create styles
const styles = StyleSheet.create({
  header: {
    fontSize: '20px',
    textAlign: 'center'
  },
  headlineWrapper: {
    margin: '10px 10px 20px',
    display: 'flex',
    flexDirection: 'row',
    height: '60px'
  },
  headline: {
    margin: 'auto'
  },
  logo: {
    width: '100px',
    margin: '20px 20px 20px 0',
  },
  subtitle: {
    padding: '10px',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: '10px',
    textTransform: 'uppercase'
  },
  eventList: {
    flexDirection: 'column',
    display: 'flex',
    overflow: 'hidden'
  },
  eventWrapper: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    border: '1px solid black'
  },
  locationWrapper: {
    marginBottom: 14,
    paddingRight: 50,
    fontSize: '12px',
    color: '#4A4A4A',
    fontWeight: 600,
  },
  title: {
    marginBottom: 16,
    display: 'inline-flex',
    fontSize: '16px',
    color: '#4A4A4A',
    fontWeight: 600,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  leftCol: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxWidth: '65%',
  },
  speakers: {
    fontSize: '12px',
    color: '#4A4A4A',
  },
  trackWrapper: {
    fontWeight: 'bold',
    fontSize: '10px',
    position: 'relative',
    paddingRight: 40,
    marginTop: 'auto',
  },
  rightCol: {
    maxWidth: '35%'
  },
  tagsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'right'
  },
  tag: {
    backgroundColor: '#F6F6F6',
    borderRadius: '14px',
    height: 18,
    margin: '8px 8px 0 0',
    padding: '4px 8px',
    textTransform: 'uppercase',
    fontSize: '10px',
    color: '#4A4A4A',
  }
});

const PrintView = ({ events, summit, nowUtc }) => {

  const getSpeakers = (event) => {
    const speakerTags = getHosts(event).map(sp => `${sp.first_name} ${sp.last_name}`);

    if (speakerTags.length > 0) {
      return (
        <View style={styles.speakers}>
          <Text>By {speakerTags.join(', ')}</Text>
        </View>
      );
    }

    return null;
  };

  const venue = summit.locations.find(l => l.class_name === 'SummitVenue');
  const summitStart = epochToMomentTimeZone(summit.start_date, summit.time_zone_id).format('MMMM Do YYYY');
  const summitEnd = epochToMomentTimeZone(summit.end_date, summit.time_zone_id).format('MMMM Do YYYY');

  return (
    <Document>
      <Page size='A4' style={styles.eventList}>
        <View style={styles.header}>
          <View style={styles.headlineWrapper}>
            <Image src={summit.logo} style={styles.logo} />
            <Text style={styles.headline}>Schedule for {summit.name}</Text>
          </View>
          <View style={styles.subtitle}>
            <View>
              <Text style={styles.label}>Venue:</Text><Text>{venue?.name}</Text>
            </View>
            <View>
              <Text style={styles.label}>Start:</Text><Text>{summitStart}</Text>
            </View>
            <View>
              <Text style={styles.label}>End:</Text><Text>{summitEnd}</Text>
            </View>
          </View>
        </View>
        {events.map(event => {
          const eventDate = event.startTimeAtTimezone.format('ddd, MMMM D');
          const eventStartTime = event.startTimeAtTimezone.format('h:mma');
          const eventEndTime = event.endTimeAtTimezone.format('h:mma');
          const venueCount = summit.locations.filter(loc => loc.class_name === 'SummitVenue');
          const locationStr = getLocation(event, summit.start_showing_venues_date, venueCount, nowUtc);

          return (
            <View
              style={{...styles.eventWrapper, borderLeft: `6px solid ${event.eventColor}`}}
              key={`event-${event.id}`}
              wrap={false}
            >
              <View style={styles.locationWrapper}>
                <Text>
                  {`${eventDate}, ${eventStartTime} - ${eventEndTime} | ${locationStr}`}
                </Text>
              </View>
              <View style={styles.title}>
                <Text>{event.title}</Text>
              </View>
              <View style={styles.footer}>
                <View style={styles.leftCol}>
                  {event.track &&
                    <View style={styles.trackWrapper}>
                      <Text>{event.track?.name}</Text>
                    </View>
                  }
                  {(event.speakers?.length > 0 || event.moderator) &&
                    <View>
                      {getSpeakers(event)}
                    </View>
                  }
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.tagsWrapper}>
                    {event.tags.map(t =>
                      <View key={`tag-${t.id}-${event.id}`} style={styles.tag}>
                        <Text>{t.tag}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

PrintView.propTypes = {
  events: PropTypes.array.isRequired,
  summit: PropTypes.object.isRequired
};

export default PrintView;

