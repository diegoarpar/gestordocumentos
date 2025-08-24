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
    implementation ("org.springframework.boot:spring-boot-starter-test")
    implementation ("org.activiti:activiti-spring-boot-starter:7.1.0.M6")
    implementation ("org.activiti:activiti-image-generator:7.1.0.M6")
    implementation ("org.mongodb:mongodb-driver-sync")
    implementation ("org.postgresql:postgresql:42.7.3")
    implementation ("com.google.code.gson:gson:2.13.1")
    implementation ("org.springframework.boot:spring-boot-starter-data-cassandra")
    compileOnly ("org.projectlombok:lombok:1.18.30") // Use the latest stable version
    annotationProcessor  ("org.projectlombok:lombok:1.18.30")
    implementation (project(":utilities:util-model"))
    implementation (project(":data:data-workflow-cassandra"))
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.test {
    useJUnitPlatform()
}

