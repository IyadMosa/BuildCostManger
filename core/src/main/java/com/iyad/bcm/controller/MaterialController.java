package com.iyad.bcm.controller;

import com.iyad.bcm.dto.MaterialDTO;
import com.iyad.bcm.service.MaterialService;
import com.iyad.model.Material;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;
    private final ModelMapper modelMapper;

    public MaterialController(MaterialService materialService, ModelMapper modelMapper) {
        this.materialService = materialService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/shop/{name}")
    public ResponseEntity<String> purchaseMaterial(@PathVariable String name, @RequestBody MaterialDTO materialDTO) throws Throwable {
        materialService.purchaseMaterial(name, materialDTO);
        return ResponseEntity.ok("Material purchased successfully");
    }

    @PutMapping("/shop/{name}")
    public ResponseEntity<MaterialDTO> updateMaterial(@PathVariable String name, @RequestBody MaterialDTO materialDTO) throws Throwable {
        Material updatedMaterial = materialService.updateMaterial(name, materialDTO);
        return ResponseEntity.ok(modelMapper.map(updatedMaterial, MaterialDTO.class));
    }

    @GetMapping("/shop/{name}")
    public ResponseEntity<List<MaterialDTO>> getAllMaterials(@PathVariable String name) {
        List<Material> materials = materialService.getAllMaterialsByShop(name);
        List<MaterialDTO> dtos = materials.stream().map(material -> modelMapper.map(material, MaterialDTO.class)).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getMaterialById(@PathVariable UUID id) {
        MaterialDTO material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable UUID id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}