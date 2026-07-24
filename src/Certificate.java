/**
 * Certificate Entity Model Class.
 * NexusED – Student Digital Twin & Growth Intelligence Platform
 */
public class Certificate {
    private String name;
    private String platform; // Google, Microsoft, Coursera, NPTEL, Udemy, Cisco, Oracle
    private String issueDate;
    private String credentialId;
    private String credentialLink;
    private String imageUrl;

    public Certificate() {}

    public Certificate(String name, String platform, String issueDate, String credentialId, String credentialLink, String imageUrl) {
        this.name = name;
        this.platform = platform;
        this.issueDate = issueDate;
        this.credentialId = credentialId;
        this.credentialLink = credentialLink;
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCredentialLink() {
        return credentialLink;
    }

    public void setCredentialLink(String credentialLink) {
        this.credentialLink = credentialLink;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Certificate{" +
                "name='" + name + '\'' +
                ", platform='" + platform + '\'' +
                ", credentialId='" + credentialId + '\'' +
                '}';
    }
}
