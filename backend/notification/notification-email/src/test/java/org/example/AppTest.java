/*
 * This source file was generated by the Gradle 'init' task
 */
package org.example;

import com.itec.notificationemail.NotificationEmailApplication;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AppTest {
    @Test void appHasAGreeting() {
        NotificationEmailApplication classUnderTest = new NotificationEmailApplication();
        assertNotNull(classUnderTest.getGreeting(), "app should have a greeting");
    }
}
