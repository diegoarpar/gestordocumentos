plugins {
    id ("java")
    id ("org.springframework.boot") version "3.5.3"
}

plugins.apply("io.spring.dependency-management")

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

dependencies {
    implementation ("com.google.code.gson:gson:2.13.1")
    implementation ("org.projectlombok:lombok:1.18.30") // Use the latest stable version
    implementation ("org.projectlombok:lombok:1.18.30")
    implementation ("org.springframework.boot:spring-boot-starter-web")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
