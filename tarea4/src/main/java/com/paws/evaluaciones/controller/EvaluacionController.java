package com.paws.evaluaciones.controller;

import com.paws.evaluaciones.model.AvisoAdopcion;
import com.paws.evaluaciones.model.Nota;
import com.paws.evaluaciones.repository.AvisoAdopcionRepository;
import com.paws.evaluaciones.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class EvaluacionController {

    @Autowired
    private AvisoAdopcionRepository avisoRepository;

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<AvisoAdopcion> avisos = avisoRepository.findAllByOrderByFechaIngresoDesc();

        //Creamos lista
        List<Map<String, Object>> avisosConPromedio = avisos.stream().map(aviso -> {
            Map<String, Object> avisoMap = new HashMap<>();
            avisoMap.put("id", aviso.getId());
            avisoMap.put("fechaIngreso", aviso.getFechaIngreso().toLocalDate());
            avisoMap.put("sector", aviso.getSector() != null ? aviso.getSector() : "N/A");
            avisoMap.put("cantidad", aviso.getCantidad());
            avisoMap.put("tipo", aviso.getTipo());
            avisoMap.put("edad", aviso.getEdad());
            avisoMap.put("unidadMedida", aviso.getUnidadMedida());
            avisoMap.put("comuna", aviso.getComuna().getNombre());

            Double promedio = notaRepository.findPromedioByAvisoId(aviso.getId());
            avisoMap.put("promedio", promedio);

            return avisoMap;
        }).toList();

        model.addAttribute("avisos", avisosConPromedio);
        return "index";
    }

    @PostMapping("/api/notas/{avisoId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> agregarNota(
            @PathVariable Integer avisoId,
            @RequestBody Map<String, Object> request) {

        Map<String, Object> response = new HashMap<>();

        if (!request.containsKey("nota")) {
            response.put("error", "La nota es requerida");
            return ResponseEntity.badRequest().body(response);
        }

        Integer nota;
        try {
            nota = Integer.parseInt(request.get("nota").toString());
        } catch (NumberFormatException e) {
            response.put("error", "La nota debe ser un número entero");
            return ResponseEntity.badRequest().body(response);
        }

        //Validar rango de la nota
        if (nota < 1 || nota > 7) {
            response.put("error", "La nota debe estar entre 1 y 7");
            return ResponseEntity.badRequest().body(response);
        }

        //Verificar que el aviso existe
        if (avisoId == null || !avisoRepository.existsById(avisoId)) {
            response.put("error", "El aviso no existe");
            return ResponseEntity.status(404).body(response);
        }

        //Guardar la nota
        Nota nuevaNota = new Nota(avisoId, nota);
        notaRepository.save(nuevaNota);

        //Obtener el nuevo promedio
        Double nuevoPromedio = notaRepository.findPromedioByAvisoId(avisoId);

        response.put("success", true);
        response.put("mensaje", "Nota agregada exitosamente");
        response.put("promedio", nuevoPromedio != null ? Math.round(nuevoPromedio * 10.0) / 10.0 : null);

        return ResponseEntity.status(201).body(response);
    }
}
