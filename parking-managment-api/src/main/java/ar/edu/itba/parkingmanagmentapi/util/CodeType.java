package ar.edu.itba.parkingmanagmentapi.util;

import java.util.UUID;
import java.util.function.Function;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Supplier;

public enum CodeType {
    EMAIL_RECOVERY("^\\d{5}$", () -> {
        int code = ThreadLocalRandom.current().nextInt(10000, 100000);
        return String.valueOf(code);
    }),

    REFRESH_TOKEN("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
            () -> UUID.randomUUID().toString()
    );

    private final String regex;
    private final Supplier<String> generator;

    CodeType(String regex, Supplier<String> generator) {
        this.regex = regex;
        this.generator = generator;
    }

    public boolean isValid(String code) {
        return code != null && code.matches(regex);
    }

    public String generate() {
        return generator.get();
    }
}
