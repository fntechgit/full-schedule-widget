# Full Schedule Widget
Full version React component for the show schedule


## Full Schedule config

   ** events                    = array of all events from the summit
   
   ** summit                    = object with the data from the summit
   
   ** marketingSettings         = object with the settings from the marketing API
   
   ** userProfile               = object with the data from the user profile
   
   ** onEventClick(event)       = method called upon event click
   
   ** onStartChat(speakerId)    = method called upon click on "Chat with Speaker", if null then button is hidden
    
   ** needsLogin(pendingAction) = method called when schedule needs user to login - for example on "Add to Schedule".
   
   title            = widget title, defaults to "Schedule"

   subtitle         = child component placed beneath the widget title, takes a component or html element. default null
   
   view             = calendar or list, defaults to calendar

   shareLink        = share url string
   
   colorSource      = from where to pull the event color; oneOf('type', 'track', 'trackGroup'), defaults to track
   
   withThumbs       = if true, show event thumbnails on list view
   
   defaultImage     = url for image to show when no eventImage and no stream thumbnail available/set
   
   showSendEmail    = show/hide button to email speaker
   
   triggerAction    = method that will take an ACTION and a payload as params and will return a promise.

   showSync         = flag to show or hide sync button, default to false

   modalSyncTitle   = title copy for modal sync functionality

   modalSyncText    = body copy for modal sync functionality

   summitLogoPrint  = custom logo to use at print schedule
   

## PUBLISH TO NPM:

1 - yarn build && yarn publish

2 - yarn publish-package

## IMPORT:

import ScheduleFull from 'full-schedule-widget';

import 'full-schedule-widget/index.css';

## DEBUG:
You can pass this hash on url to override current time, time must be in this format and on summit timezone

\#now=2020-06-03,10:59:50

# Utils

$ npm rebuild node-sass --force
