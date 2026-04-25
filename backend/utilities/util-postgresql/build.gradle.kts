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
    implementation ("org.postgresql:postgresql:42.7.3")
    implementation ("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation (project(":utilities:util-secrets"))
    compileOnly ("org.projectlombok:lombok:1.18.30")
    annotationProcessor  ("org.projectlombok:lombok:1.18.30")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.test {
    useJUnitPlatform()
}
