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
    implementation ("org.springframework.boot:spring-boot-starter-web")
    implementation ("org.springframework.boot:spring-boot-starter-actuator")
    implementation(project(":data:data-user-authorization"))
    implementation ("org.springframework.boot:spring-boot-starter-web")
    implementation ("org.springframework.boot:spring-boot-starter-actuator")
    implementation ("org.springframework.boot:spring-boot-starter-test")
    implementation (project(":utilities:util-model"))
    implementation ("io.jsonwebtoken:jjwt-api:0.12.5")
    implementation ("io.jsonwebtoken:jjwt-impl:0.12.5")
    implementation ("io.jsonwebtoken:jjwt-jackson:0.12.5")
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
