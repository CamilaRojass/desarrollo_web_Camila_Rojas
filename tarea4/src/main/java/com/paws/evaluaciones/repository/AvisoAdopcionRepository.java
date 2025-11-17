package com.paws.evaluaciones.repository;

import com.paws.evaluaciones.model.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Integer> {
    List<AvisoAdopcion> findAllByOrderByFechaIngresoDesc();
}
