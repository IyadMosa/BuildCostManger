package com.iyad.bcm.controller;

import com.iyad.bcm.dto.ShopDTO;
import com.iyad.bcm.mapper.ShopMapper;
import com.iyad.bcm.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final ShopMapper shopMapper;

    @PostMapping
    public ResponseEntity<String> createShop(@RequestBody ShopDTO shopDTO) {
        shopService.createOrUpdateShop(shopDTO);
        return ResponseEntity.ok("Shop created successfully");
    }

    @GetMapping
    public ResponseEntity<List<ShopDTO>> getAllShops() {
        List<ShopDTO> dtos = shopService.getAllShops();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{name}")
    public ResponseEntity<ShopDTO> getShopByName(@PathVariable String name) throws Throwable {
        return ResponseEntity.ok(shopService.getShopByName(name));
    }


    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteShop(@PathVariable String name) throws Throwable {
        shopService.deleteShop(name);
        return ResponseEntity.noContent().build();
    }
}
