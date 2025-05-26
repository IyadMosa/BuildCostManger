package com.iyad.security;

import java.util.UUID;

public class ProjectContext {
    private static final ThreadLocal<UUID> currentProjectId = new ThreadLocal<>();

    public static void set(UUID projectId) {
        currentProjectId.set(projectId);
    }

    public static UUID get() {
        return currentProjectId.get();
    }

    public static void clear() {
        currentProjectId.remove();
    }
}
