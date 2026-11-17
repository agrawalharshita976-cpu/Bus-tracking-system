# BusWatch delivery checklist

## Dashboard shell and monitoring state
- [x] Build a responsive operational dashboard overview with current gate status, active monitoring indicators, and key daily metrics.
- [x] Add a console layout optimized for desktop monitoring screens while remaining usable on tablets and mobile devices.

## Event operations
- [x] Show a live event feed with recent bus detections, IN/OUT direction, timestamps, confidence, and gate context.
- [x] Add realistic sample data plus frontend-ready loading, empty, error, and disconnected data states.
- [x] Add an uncertain detection and manual review queue with evidence-oriented event details and review states.

## Fleet and schedule visibility
- [x] Add a bus status table listing each bus and its latest IN and OUT times with current on-campus/off-campus state.
- [x] Add a daily timeline visualization of bus entry and exit events across the operating day.
- [x] Add schedule comparison with early, on-time, and delayed flags based on planned arrival or departure times.

## Gate analytics
- [x] Add gate statistics summarizing entries, exits, unique buses, delays, and detection confidence trends.

## Frontend handoff
- [ ] Replace sample data with FastAPI / computer-vision API responses when the backend is available.
