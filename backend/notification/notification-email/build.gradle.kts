plugins {
    id ("java")
    id ("org.springframework.boot") version "3.5.3";
}

plugins.apply ("io.spring.dependency-management")

repositories {
    mavenCentral()
}

dependencies {
    implementation ("org.springframework.boot:spring-boot-starter-web")
    implementation ("org.springframework.boot:spring-boot-starter-actuator")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

tasks.register<Wrapper>("wrapper") {
    gradleVersion = "8.13"
}

group = "com.itec.notificationemail"
version = "0.0.1-SNAPSHOT"


tasks.test {
    useJUnitPlatform()
}

springBoot {
    mainClass.set("com.itec.notificationemail.NotificationEmailApplication")
}