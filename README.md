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
   
   view             = calendar or list, defaults to calendar

   shareLink        = share url string
   
   colorSource      = from where to pull the event color; oneOf('type', 'track', 'trackGroup'), defaults to track
   
   withThumbs       = if true, show event thumbnails on list view
   
   defaultImage     = url for image to show when no eventImage and no stream thumbnail available/set
   
   showSendEmail    = show/hide button to email speaker
   
   triggerAction    = method that will take an ACTION and a payload as params and will return a promise.
   

## PUBLISH TO NPM:

1 - yarn build && yarn publish

2 - yarn publish-package

## IMPORT:

import ScheduleFull from 'full-schedule-widget';

import 'full-schedule-widget/index.css';

## DEBUG:
You can pass this hash on url to override current time, time must be in this format and on summit timezone

\#now=2020-06-03,10:59:50