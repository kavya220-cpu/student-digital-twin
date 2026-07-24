package src;

public class CacheManager {
    private static final long CACHE_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours

    public static boolean isCacheExpired(double lat, double lng) {
        long lastSync = EventRepository.getLastSyncTime(lat, lng);
        if (lastSync == 0) {
            return true; // No record exists
        }
        return (System.currentTimeMillis() - lastSync) > CACHE_EXPIRY_MS;
    }

    public static void recordSync(double lat, double lng) {
        EventRepository.updateSyncTime(lat, lng);
    }
}
