package com.itec.util.secret.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Service
@Slf4j
@RequiredArgsConstructor
public class UtilSecretService {

    @Value("${secrets.file.location}")
    private String secretsPath;

    private final ConfigurableEnvironment configurableEnvironment;

    public void loadSecrets() {
        var path = Path.of(secretsPath);

        if (!Files.exists(path)) {
            log.warn("Secrets file not found at '{}'. Skipping secret injection. "
                    + "Set SECRETS_FILE_PATH to override the location.", secretsPath);
            return;
        }

        var properties = loadSecretsFile(path);
        var propertiesMap = new HashMap<String, Object>((Map) properties);
        if (propertiesMap.isEmpty()) {
            log.warn("Secrets file at '{}' was empty or could not be parsed.", secretsPath);
            return;
        }

        configurableEnvironment.getPropertySources()
                .addFirst(new MapPropertySource("myCustomSource", propertiesMap));

        log.info("Loaded {} secret(s) from '{}' into Spring environment.",
                propertiesMap.size(), secretsPath);
    }

    /**
     * Reads a standard .properties file and returns its contents as a Map.
     * Keys with blank values are included so the property exists but is empty.
     */
    private Properties loadSecretsFile(Path path) {
        var props = new Properties();
        try (InputStream is = Files.newInputStream(path)) {
            props.load(is);
        } catch (IOException exception) {
            log.error("Failed to read secrets file at '{}': {}", path, exception.getMessage(), exception);
            return null;
        }
        return props;
    }
}
