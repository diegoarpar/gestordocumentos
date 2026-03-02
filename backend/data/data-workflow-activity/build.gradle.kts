plugins {
    id ("java")
    id ("org.springframework.boot") version "3.5.3";
}

plugins.apply ("io.spring.dependency-management")

repositories {
    mavenCentral()
}

dependencies {
    implementation ("org.springframework.boot:spring-boot-starter-test")
    implementation ("org.postgresql:postgresql:42.7.3")
    implementation ("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation ("org.activiti:activiti-spring-boot-starter:7.1.0.M6")
    implementation ("org.activiti:activiti-image-generator:7.1.0.M6")
    annotationProcessor ("org.projectlombok:lombok:1.18.30") // Use the latest stable version
    compileOnly ("org.projectlombok:lombok:1.18.30")
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

group = "com.data.workflow.cassandra"
version = "0.0.1-SNAPSHOT"


tasks.test {
    useJUnitPlatform()
}

springBoot {
    mainClass.set("com.data.workflow.cassandra.DataWorkflowCassandra")
}
