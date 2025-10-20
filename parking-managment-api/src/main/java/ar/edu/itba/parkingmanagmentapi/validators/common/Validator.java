package ar.edu.itba.parkingmanagmentapi.validators.common;

public abstract class Validator<V> {
    public static final String CONCATENATE = "%s.%s";
    public static final String ERROR_MESSAGE_MANDATORY = "validation.field.mandatory";

    public void validate(V validatable, String... args) {
        String path = joinArgs(args);
        validate(validatable, path);
    }

    protected abstract void validate(V validatable, String path);

    private static String joinArgs(String[] args) {
        String path = "";
        for (String arg : args) {
            if (!path.isEmpty()) {
                path = String.format(CONCATENATE, path, arg);
            } else {
                path = arg;
            }
        }
        return path;
    }
}
