package src;

import java.util.HashMap;
import java.util.Map;

public class LocationService {
    private static final Map<String, double[]> CITY_COORDINATES = new HashMap<>();

    static {
        CITY_COORDINATES.put("bangalore", new double[]{12.9716, 77.5946});
        CITY_COORDINATES.put("bengaluru", new double[]{12.9716, 77.5946});
        CITY_COORDINATES.put("silicon valley", new double[]{37.7749, -122.4194});
        CITY_COORDINATES.put("san francisco", new double[]{37.7749, -122.4194});
        CITY_COORDINATES.put("mumbai", new double[]{19.0760, 72.8777});
        CITY_COORDINATES.put("new york", new double[]{40.7128, -74.0060});
        CITY_COORDINATES.put("london", new double[]{51.5074, -0.1278});
        CITY_COORDINATES.put("delhi", new double[]{28.7041, 77.1025});
        CITY_COORDINATES.put("hyderabad", new double[]{17.3850, 78.4867});
        CITY_COORDINATES.put("pune", new double[]{18.5204, 73.8567});
    }

    public static double[] resolveCoordinates(String city) {
        if (city == null || city.trim().isEmpty()) {
            return CITY_COORDINATES.get("bangalore"); // Default fallback
        }
        String cleanCity = city.trim().toLowerCase();
        for (String key : CITY_COORDINATES.keySet()) {
            if (cleanCity.contains(key) || key.contains(cleanCity)) {
                return CITY_COORDINATES.get(key);
            }
        }
        return CITY_COORDINATES.get("bangalore"); // Default fallback
    }
}
