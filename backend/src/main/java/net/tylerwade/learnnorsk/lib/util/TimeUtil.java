package net.tylerwade.learnnorsk.lib.util;


import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtil {

    public static String createCreatedAt() {
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date()).toString();
    }


}
