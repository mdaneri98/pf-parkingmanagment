package ar.edu.itba.parkingmanagmentapi.util;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class LocaleContextUtils {

    private static MessageSource messageSource;

    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        LocaleContextUtils.messageSource = messageSource;
    }

    /**
     * Get a localized message for the current locale
     */
    public static String getMessage(String key, Object... args) {
        Locale locale = getCurrentLocale();
        return messageSource.getMessage(key, args, key, locale);
    }

    /**
     * Get a localized message for a specific locale
     */
    public static String getMessage(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, key, locale);
    }

    /**
     * Get the current locale from LocaleContextHolder
     */
    public static Locale getCurrentLocale() {
        Locale locale = LocaleContextHolder.getLocale();
        if (locale != null) {
            return locale;
        }
        
        // Fall back to default language if no locale is set
        return Locale.forLanguageTag(AppConstants.DEFAULT_LANGUAGE);
    }

    /**
     * Check if a message key exists
     */
    public static boolean hasMessage(String key) {
        try {
            Locale locale = getCurrentLocale();
            messageSource.getMessage(key, null, locale);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
