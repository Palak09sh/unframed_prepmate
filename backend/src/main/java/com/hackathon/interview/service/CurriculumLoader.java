package com.hackathon.interview.service;

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
 * <p>NOTE (ownership): friend2's helper for the engine's data dependency.
 * If Radhika already parses curriculum.json her own way, use her loader and
 * drop this file. The engine itself only needs the resulting map.</p>
 */
public final class CurriculumLoader {

    private CurriculumLoader() {
    }

    public static Map<Integer, CurriculumDay> load() {
        try (InputStream in = CurriculumLoader.class.getResourceAsStream("/curriculum.json")) {
            if (in == null) {
                throw new IllegalStateException("curriculum.json not found on classpath");
            }
            ObjectMapper mapper = new ObjectMapper();
            CurriculumFile root = mapper.readValue(in, CurriculumFile.class);
            Map<Integer, CurriculumDay> map = new LinkedHashMap<>();
            for (Module m : root.modules()) {
                for (CurriculumDay d : m.days()) {
                    map.put(d.day(), d);
                }
            }
            return Map.copyOf(map);
        } catch (IOException e) {
            throw new UncheckedIOException("failed to read curriculum.json", e);
        }
    }

    private record CurriculumFile(List<Module> modules) {
    }

    private record Module(String name, List<CurriculumDay> days) {
    }
}
