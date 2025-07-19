/**
 * Represents a geographical coordinate with latitude and longitude.
 */
export interface Coordinate {
  /**
   * The latitude of the coordinate.
   */
  lat: number;
  /**
   * The longitude of the coordinate.
   */
  lng: number;
}

/**
 * Represents a delivery route, which is a sequence of coordinates.
 */
export interface Route {
  /**
   * An array of geographical coordinates representing the route.
   */
  coordinates: Coordinate[];
  /**
   * The distance of the route in meters.
   */
  distance: number;
}

/**
 * Geocodes a place name to latitude and longitude coordinates.
 * @param placeName The name of the place to geocode.
 * @returns A promise that resolves with the coordinate, or null if geocoding fails.
 */
export async function getCoordinatesFromPlaceName(placeName: string): Promise<Coordinate | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is missing. Please set the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.');
    return null;
  }

  const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

  try {
    const response = await fetch(geocodingApiUrl);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error(`Geocoding failed for ${placeName} with status: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding place name:', error);
    return null;
  }
}
