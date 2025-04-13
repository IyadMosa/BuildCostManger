package com.iyad.enums;

public enum WorkerSpecialty {
    ARCHITECT("Architect", "مهندس معماري"),
    CIVIL_ENGINEER("Civil Engineer", "مهندس مدني"),
    ELECTRICIAN("Electrician", "كهربائي"),
    PLUMBER("Plumber", "سباك"),
    CARPENTER("Carpenter", "نجار"),
    MASON("Mason", "عامل بناء"),
    PAINTER("Painter", "دهان"),
    TILE_INSTALLER("Tile Installer", "عامل تركيب البلاط"),
    ROOFER("Roofer", "عامل تركيب الأسقف"),
    HVAC_TECHNICIAN("HVAC Technician", "فني تكييف"),
    INTERIOR_DESIGNER("Interior Designer", "مصمم داخلي"),
    LANDSCAPER("Landscaper", "مصمم حدائق"),
    ALUMINUM_AND_GLASS_INSTALLER("Aluminum and Glass Installer", "عامل تركيب الألمنيوم والزجاج"),
    WELDER("Welder", "لحام"),
    DOOR_AND_WINDOW_INSTALLER("Door and Window Installer", "عامل تركيب الأبواب والنوافذ"),
    DRYWALL_INSTALLER("Drywall Installer", "عامل تركيب الألواح الجبسية");

    private final String englishName;
    private final String arabicName;

    WorkerSpecialty(String englishName, String arabicName) {
        this.englishName = englishName;
        this.arabicName = arabicName;
    }

    public String getName(String language) {
        return "ar".equalsIgnoreCase(language) ? arabicName : englishName;
    }

    @Override
    public String toString() {
        return englishName;
    }

    public static WorkerSpecialty valueOfLabel(String label) {
        for (WorkerSpecialty e : values()) {
            if (e.englishName.equalsIgnoreCase(label) || e.arabicName.equalsIgnoreCase(label)) {
                return e;
            }
        }
        throw new IllegalArgumentException("No enum constant with label " + label);
    }

}
