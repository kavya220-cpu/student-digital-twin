import java.util.regex.Pattern;

/**
 * Reusable backend validation logic demonstration for Student Profile Setup.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class ProfileValidator {

    // Regular expression for standard RFC 5322 email matching
    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    /**
     * Reusable method to validate email address structure.
     * @param email The target email address string.
     * @return true if valid, false otherwise.
     */
    public static boolean validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Reusable method to validate CGPA is within academic scale (0.0 to 10.0 inclusive).
     * @param cgpa The target CGPA value.
     * @return true if valid, false otherwise.
     */
    public static boolean validateCGPA(double cgpa) {
        return cgpa >= 0.0 && cgpa <= 10.0;
    }

    /**
     * Reusable method to validate Roll Number syntax and presence.
     * @param rollNumber The target roll number string.
     * @return true if present and non-empty, false otherwise.
     */
    public static boolean validateRollNumber(String rollNumber) {
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            return false;
        }
        // General check: must be at least 3 alphanumeric characters
        return rollNumber.trim().matches("^[a-zA-Z0-9\\-/]{3,20}$");
    }

    /**
     * Reusable method to validate standard required string fields are non-empty.
     * @param fields Array of string fields to check.
     * @return true if all fields are valid, false if any field is null or empty.
     */
    public static boolean validateRequiredFields(String... fields) {
        if (fields == null) {
            return false;
        }
        for (String field : fields) {
            if (field == null || field.trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Standalone main runner to demonstrate validator capabilities.
     */
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("    NexusED - ProfileValidator Demonstration      ");
        System.out.println("==================================================");

        // Test Cases: Email
        String testEmail1 = "student@nexused.edu";
        String testEmail2 = "invalid-email@";
        System.out.println("Email '" + testEmail1 + "' Valid? " + validateEmail(testEmail1));
        System.out.println("Email '" + testEmail2 + "' Valid? " + validateEmail(testEmail2));

        // Test Cases: CGPA
        double testCgpa1 = 9.45;
        double testCgpa2 = 11.2;
        System.out.println("CGPA '" + testCgpa1 + "' Valid? " + validateCGPA(testCgpa1));
        System.out.println("CGPA '" + testCgpa2 + "' Valid? " + validateCGPA(testCgpa2));

        // Test Cases: Roll Number
        String testRoll1 = "CS-2026/409";
        String testRoll2 = "";
        System.out.println("Roll Number '" + testRoll1 + "' Valid? " + validateRollNumber(testRoll1));
        System.out.println("Roll Number '" + testRoll2 + "' Valid? " + validateRollNumber(testRoll2));

        // Test Cases: Required Fields
        boolean allFieldsPresent = validateRequiredFields("Alex Mercer", "MIT College", "Computer Science");
        System.out.println("Are all required fields present? " + allFieldsPresent);

        System.out.println("==================================================");
    }
}
