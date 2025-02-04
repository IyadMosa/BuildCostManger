package com.iyad.bcm.controller;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.bcm.mapper.ShopMapper;
import com.iyad.bcm.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final ShopMapper mapper;

    @PostMapping
    public ResponseEntity<String> createOrUpdateShop(@RequestBody ShopDTO shopDTO) {
        shopService.createOrUpdateShop(shopDTO);
        return ResponseEntity.ok("Shop created successfully");
    }

    @GetMapping
    public ResponseEntity<Set<?>> getAllShops(@RequestParam boolean nameOnly) {
        return ResponseEntity.ok(shopService.getAllShops(nameOnly));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteShop(@PathVariable String name) throws Throwable {
        shopService.deleteShop(name);
        return ResponseEntity.noContent().build();
    }
}
