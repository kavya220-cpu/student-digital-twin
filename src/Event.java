package src;

public class Event {
    private String id;
    private String title;
    private String description;
    private String organizer;
    private String companyLogo;
    private String location;
    private double latitude;
    private double longitude;
    private String mode; // Online, Offline, Hybrid
    private String eventDate;
    private String registrationDeadline;
    private String category; // Hackathon, Workshop, Conference, Bootcamp, Internship, Coding Contest, Webinar, Tech Meetup
    private String difficulty; // Beginner, Intermediate, Advanced
    private String registrationFee;
    private String registrationUrl;
    private String agenda;
    private String eligibility;
    private String requiredSkills;
    private boolean hasCertificate;
    private String source;

    public Event() {}

    public Event(String id, String title, String description, String organizer, String companyLogo,
                 String location, double latitude, double longitude, String mode, String eventDate,
                 String registrationDeadline, String category, String difficulty, String registrationFee,
                 String registrationUrl, String agenda, String eligibility, String requiredSkills,
                 boolean hasCertificate, String source) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.organizer = organizer;
        this.companyLogo = companyLogo;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.mode = mode;
        this.eventDate = eventDate;
        this.registrationDeadline = registrationDeadline;
        this.category = category;
        this.difficulty = difficulty;
        this.registrationFee = registrationFee;
        this.registrationUrl = registrationUrl;
        this.agenda = agenda;
        this.eligibility = eligibility;
        this.requiredSkills = requiredSkills;
        this.hasCertificate = hasCertificate;
        this.source = source;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getRegistrationFee() { return registrationFee; }
    public void setRegistrationFee(String registrationFee) { this.registrationFee = registrationFee; }

    public String getRegistrationUrl() { return registrationUrl; }
    public void setRegistrationUrl(String registrationUrl) { this.registrationUrl = registrationUrl; }

    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public boolean isHasCertificate() { return hasCertificate; }
    public void setHasCertificate(boolean hasCertificate) { this.hasCertificate = hasCertificate; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
