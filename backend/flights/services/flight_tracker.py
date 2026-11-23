import math
import os
import requests
from datetime import datetime, timezone
from django.utils import timezone as dj_timezone

# ── Airport coordinates (Indian hubs + connected international) ──────────────
AIRPORT_COORDINATES = {
    'DEL': {'lat': 28.5562, 'lon': 77.1000, 'city': 'New Delhi',   'name': 'Indira Gandhi International Airport'},
    'BOM': {'lat': 19.0896, 'lon': 72.8656, 'city': 'Mumbai',      'name': 'Chhatrapati Shivaji Maharaj International Airport'},
    'BLR': {'lat': 13.1986, 'lon': 77.7066, 'city': 'Bengaluru',   'name': 'Kempegowda International Airport'},
    'MAA': {'lat': 12.9941, 'lon': 80.1709, 'city': 'Chennai',     'name': 'Chennai International Airport'},
    'CCU': {'lat': 22.6547, 'lon': 88.4467, 'city': 'Kolkata',     'name': 'Netaji Subhash Chandra Bose International Airport'},
    'HYD': {'lat': 17.2403, 'lon': 78.4294, 'city': 'Hyderabad',   'name': 'Rajiv Gandhi International Airport'},
    'COK': {'lat': 10.1556, 'lon': 76.4019, 'city': 'Kochi',       'name': 'Cochin International Airport'},
    'GOI': {'lat': 15.3808, 'lon': 73.8314, 'city': 'Goa (Dabolim)', 'name': 'Dabolim Airport'},
    'GOX': {'lat': 15.7483, 'lon': 73.8753, 'city': 'Goa (Mopa)', 'name': 'Manohar International Airport'},
    'AMD': {'lat': 23.0772, 'lon': 72.6347, 'city': 'Ahmedabad',   'name': 'Sardar Vallabhbhai Patel International Airport'},
    'PNQ': {'lat': 18.5822, 'lon': 73.9197, 'city': 'Pune',        'name': 'Pune International Airport'},
    'JAI': {'lat': 26.8242, 'lon': 75.8122, 'city': 'Jaipur',      'name': 'Jaipur International Airport'},
    'DXB': {'lat': 25.2532, 'lon': 55.3657, 'city': 'Dubai',       'name': 'Dubai International Airport'},
    'SIN': {'lat': 1.3644,  'lon': 103.9915,'city': 'Singapore',   'name': 'Singapore Changi Airport'},
    'BKK': {'lat': 13.6900, 'lon': 100.7501,'city': 'Bangkok',     'name': 'Suvarnabhumi Airport'},
    'LHR': {'lat': 51.4700, 'lon': -0.4543, 'city': 'London',      'name': 'Heathrow Airport'},
}

def get_airport_coords(code):
    return AIRPORT_COORDINATES.get(
        code.upper(),
        {'lat': 28.6139, 'lon': 77.2090, 'city': code, 'name': f'{code} Airport'}
    )

def calculate_distance_between_codes(code1, code2):
    """Calculates geodesic distance in km between two airport IATA codes."""
    c1 = get_airport_coords(code1)
    c2 = get_airport_coords(code2)
    R = 6371
    lat1, lon1 = math.radians(c1['lat']), math.radians(c1['lon'])
    lat2, lon2 = math.radians(c2['lat']), math.radians(c2['lon'])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return max(150, round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))))


def _bearing(origin, dest):
    """Returns the initial true bearing (degrees) from origin to destination."""
    lat1 = math.radians(origin['lat'])
    lat2 = math.radians(dest['lat'])
    dlon = math.radians(dest['lon'] - origin['lon'])
    x = math.sin(dlon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    return round((math.degrees(math.atan2(x, y)) + 360) % 360, 1)


def query_opensky_network(callsign: str):
    """
    Attempts to fetch live ADS-B state vector from the OpenSky Network REST API
    for the given callsign (e.g. '6E2041', 'QP1302').

    Authentication: Optional. Set OPENSKY_USERNAME + OPENSKY_PASSWORD env vars
    for authenticated access (higher rate limit: 400 req/day vs 100 anon).

    Returns a dict with live telemetry, or None when unavailable.
    """
    if not callsign:
        return None

    username = os.environ.get('OPENSKY_USERNAME', '').strip()
    password  = os.environ.get('OPENSKY_PASSWORD', '').strip()
    auth = (username, password) if username and password else None

    # Normalise callsign: remove dashes/spaces, uppercase
    clean = callsign.replace('-', '').replace(' ', '').upper()

    try:
        # Query by callsign — much smaller payload than fetching all states
        url = 'https://opensky-network.org/api/states/all'
        params = {'callsign': clean}
        resp = requests.get(url, params=params, auth=auth, timeout=4.0)

        if resp.status_code == 429:
            return {'_error': 'rate_limited', '_label': 'Rate Limited – Schedule-Based Position Shown'}

        if resp.status_code == 401:
            return {'_error': 'auth_failed', '_label': 'OpenSky Auth Failed – Schedule-Based Position Shown'}

        if resp.status_code != 200:
            return None  # Triggers schedule fallback gracefully

        data = resp.json()
        states = data.get('states') or []

        if not states:
            return {'_error': 'not_in_feed', '_label': 'Aircraft Not in ADS-B Feed – Schedule-Based Position Shown'}

        # states[0] is the best match (we queried by callsign)
        s = states[0]
        # OpenSky state vector columns:
        # [icao24, callsign, origin_country, time_position, last_contact,
        #  longitude, latitude, baro_altitude, on_ground, velocity,
        #  true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]

        lon  = s[5]
        lat  = s[6]
        baro = s[7]   # metres
        vel  = s[9]   # m/s
        hdg  = s[10]  # degrees
        vr   = s[11]  # m/s vertical rate

        if lat is None or lon is None:
            return {'_error': 'no_position', '_label': 'No Position in ADS-B Feed – Schedule-Based Position Shown'}

        altitude_ft = round(baro * 3.28084) if baro else None
        speed_knots = round(vel * 1.94384)  if vel  else None
        speed_kmh   = round(vel * 3.6)      if vel  else None

        if vr is None:
            vr_label = 'Level'
        elif vr > 1:
            vr_label = f'Climbing +{round(vr * 196.85)} ft/min'
        elif vr < -1:
            vr_label = f'Descending {round(vr * 196.85)} ft/min'
        else:
            vr_label = 'Level'

        return {
            'source': 'live',
            'source_label': 'Live ADS-B — OpenSky Network',
            'icao24': s[0],
            'callsign': (s[1] or '').strip(),
            'origin_country': s[2],
            'latitude': round(lat, 4),
            'longitude': round(lon, 4),
            'altitude_feet': altitude_ft,
            'ground_speed_knots': speed_knots,
            'ground_speed_kmh': speed_kmh,
            'heading_degrees': hdg,
            'vertical_rate_label': vr_label,
            'on_ground': s[8],
        }

    except requests.Timeout:
        return {'_error': 'timeout', '_label': 'OpenSky Timeout – Schedule-Based Position Shown'}
    except Exception:
        return {'_error': 'unavailable', '_label': 'OpenSky Unavailable – Schedule-Based Position Shown'}


def _schedule_estimate(elapsed_seconds, total_seconds, origin_coords, dest_coords):
    """
    Returns interpolated position and physics-based altitude/speed estimates
    derived purely from the flight schedule (departure & arrival times).
    These are ESTIMATES, not GPS readings.
    """
    progress_pct = round((elapsed_seconds / total_seconds) * 100, 1)
    fraction = progress_pct / 100.0

    curr_lat = round(origin_coords['lat'] + (dest_coords['lat'] - origin_coords['lat']) * fraction, 4)
    curr_lon = round(origin_coords['lon'] + (dest_coords['lon'] - origin_coords['lon']) * fraction, 4)

    if progress_pct < 15:
        phase = 'Climbing'
        altitude_ft = int(progress_pct * 2200)
        speed_knots = int(250 + progress_pct * 15)
        vr_label = 'Climbing'
    elif progress_pct > 85:
        phase = 'Descent & Approach'
        altitude_ft = max(1000, int(35000 - ((progress_pct - 85) * 2200)))
        speed_knots = max(160, int(480 - ((progress_pct - 85) * 18)))
        vr_label = 'Descending'
    else:
        phase = 'Cruising'
        altitude_ft = 35000
        speed_knots = 485
        vr_label = 'Level'

    return {
        'phase': phase,
        'latitude': curr_lat,
        'longitude': curr_lon,
        'altitude_feet': altitude_ft,
        'ground_speed_knots': speed_knots,
        'ground_speed_kmh': round(speed_knots * 1.852, 1),
        'vertical_rate_label': vr_label,
    }


def calculate_live_flight_telemetry(flight):
    """
    Returns real-time telemetry for a flight.

    Priority:
      1. Live ADS-B data from OpenSky Network (if available & callsign matches)
      2. Schedule-based position estimate (always available as fallback)

    The response always includes a 'data_source' field:
      'live'              — real GPS/ADS-B from OpenSky
      'schedule_estimate' — calculated from departure/arrival schedule
    """
    now = dj_timezone.now()
    dep = flight.departure_time
    arr = flight.arrival_time

    origin_coords = get_airport_coords(flight.origin_code)
    dest_coords   = get_airport_coords(flight.destination_code)
    bearing_deg   = _bearing(origin_coords, dest_coords)

    total_seconds   = max((arr - dep).total_seconds(), 60)
    elapsed_seconds = (now - dep).total_seconds()

    # ── Determine lifecycle phase ────────────────────────────────────────────
    if flight.status == 'CANCELLED':
        static_phase = 'Cancelled'
        progress_pct = 0
        est = {'phase': static_phase, 'latitude': origin_coords['lat'],
               'longitude': origin_coords['lon'], 'altitude_feet': 0,
               'ground_speed_knots': 0, 'ground_speed_kmh': 0, 'vertical_rate_label': 'N/A'}
    elif elapsed_seconds < -1800:
        static_phase = 'Scheduled'
        progress_pct = 0
        est = {'phase': static_phase, 'latitude': origin_coords['lat'],
               'longitude': origin_coords['lon'], 'altitude_feet': 0,
               'ground_speed_knots': 0, 'ground_speed_kmh': 0, 'vertical_rate_label': 'N/A'}
    elif -1800 <= elapsed_seconds < 0:
        static_phase = 'Boarding & Taxiing'
        progress_pct = 0
        est = {'phase': static_phase, 'latitude': origin_coords['lat'],
               'longitude': origin_coords['lon'], 'altitude_feet': 0,
               'ground_speed_knots': 15, 'ground_speed_kmh': 28, 'vertical_rate_label': 'Ground'}
    elif 0 <= elapsed_seconds <= total_seconds:
        static_phase = None  # determined inside _schedule_estimate
        progress_pct = round((elapsed_seconds / total_seconds) * 100, 1)
        est = _schedule_estimate(elapsed_seconds, total_seconds, origin_coords, dest_coords)
    else:
        static_phase = 'Arrived at Gate'
        progress_pct = 100
        est = {'phase': static_phase, 'latitude': dest_coords['lat'],
               'longitude': dest_coords['lon'], 'altitude_feet': 0,
               'ground_speed_knots': 0, 'ground_speed_kmh': 0, 'vertical_rate_label': 'N/A'}

    # ── Attempt live OpenSky lookup (only when in-air) ───────────────────────
    opensky_live = None
    opensky_note = 'Not queried — flight not airborne'

    if static_phase is None:  # i.e. currently airborne
        opensky_result = query_opensky_network(flight.flight_number)

        if opensky_result and 'source' in opensky_result and opensky_result['source'] == 'live':
            opensky_live = opensky_result
            opensky_note = opensky_result.get('source_label', 'Live ADS-B — OpenSky Network')
        elif opensky_result and '_label' in opensky_result:
            opensky_note = opensky_result['_label']
        else:
            opensky_note = 'Not in ADS-B Feed – Schedule-Based Position Shown'

    # ── Build final telemetry block ──────────────────────────────────────────
    if opensky_live:
        data_source = 'live'
        data_source_label = opensky_live.get('source_label', 'Live ADS-B — OpenSky Network')
        telemetry = {
            'latitude': opensky_live['latitude'],
            'longitude': opensky_live['longitude'],
            'altitude_feet': opensky_live.get('altitude_feet'),
            'ground_speed_knots': opensky_live.get('ground_speed_knots'),
            'ground_speed_kmh': opensky_live.get('ground_speed_kmh'),
            'heading_degrees': opensky_live.get('heading_degrees', bearing_deg),
            'vertical_rate': opensky_live.get('vertical_rate_label', 'Unknown'),
        }
        flight_phase = 'Live Tracked'
    else:
        data_source = 'schedule_estimate'
        data_source_label = 'Estimated from flight schedule (OpenSky unavailable)'
        telemetry = {
            'latitude': est['latitude'],
            'longitude': est['longitude'],
            'altitude_feet': est['altitude_feet'],
            'ground_speed_knots': est['ground_speed_knots'],
            'ground_speed_kmh': est['ground_speed_kmh'],
            'heading_degrees': bearing_deg,
            'vertical_rate': est['vertical_rate_label'],
        }
        flight_phase = static_phase or est.get('phase', 'In Flight')

    return {
        'flight_id': flight.id,
        'flight_number': flight.flight_number,
        'airline': flight.airline,
        'aircraft_model': flight.aircraft_model,
        'status': flight.status,
        'flight_phase': flight_phase,
        'delay_minutes': flight.delay_minutes,
        'progress_percentage': progress_pct,
        'data_source': data_source,
        'data_source_label': data_source_label,
        'opensky_note': opensky_note,
        'telemetry': telemetry,
        'route': {
            'origin': {
                'code': flight.origin_code,
                'city': flight.origin_city,
                'airport': flight.origin_airport,
                'coords': origin_coords,
                'terminal': flight.terminal,
                'gate': flight.gate,
                'scheduled_departure': flight.departure_time,
            },
            'destination': {
                'code': flight.destination_code,
                'city': flight.destination_city,
                'airport': flight.destination_airport,
                'coords': dest_coords,
                'scheduled_arrival': flight.arrival_time,
            },
        },
        'last_updated': now.isoformat(),
    }
