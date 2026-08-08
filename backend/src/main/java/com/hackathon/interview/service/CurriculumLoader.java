package com.hackathon.interview.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.interview.model.CurriculumDay;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Loads {@code curriculum.json} (on the classpath) into the day -&gt;
 * {@link CurriculumDay} map the engine is constructed with.
 *
 * <p>The canonical AI Cohort curriculum is a flat JSON array of day objects
 * ({@code [{day, module, title, type, tools, objectives}, ...]}). The
 * {@code module} grouping field is carried only as metadata on the wire and is
 * ignored here — the engine needs just the day -&gt; {@link CurriculumDay} map.</p>
 */
public final class CurriculumLoader {

    private CurriculumLoader() {
    }

    public static Map<Integer, CurriculumDay> load() {
        try (InputStream in = CurriculumLoader.class.getResourceAsStream("/curriculum.json")) {
            if (in == null) {
                throw new IllegalStateException("curriculum.json not found on classpath");
            }
            ObjectMapper mapper = new ObjectMapper()
                    .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            List<CurriculumDay> days = mapper.readValue(in, new TypeReference<List<CurriculumDay>>() { });
            Map<Integer, CurriculumDay> map = new LinkedHashMap<>();
            for (CurriculumDay d : days) {
                map.put(d.day(), d);
            }
            return Map.copyOf(map);
        } catch (IOException e) {
            throw new UncheckedIOException("failed to read curriculum.json", e);
        }
    }
}
