package com.bookmagasin.web.controller;

import com.bookmagasin.entity.Promotion;
import com.bookmagasin.service.PromotionService;
import com.bookmagasin.web.dto.PromotionDto;
import com.bookmagasin.web.dtoResponse.PromotionResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    public ResponseEntity<PromotionResponseDto> create(@RequestBody PromotionDto dto) {
        return new ResponseEntity<>(promotionService.create(dto), HttpStatus.CREATED);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCode(@RequestBody Map<String, Object> req){
        try{
        String code=req.get("code").toString();
        double totalAmount=Double.parseDouble(req.get("totalAmount").toString());

        PromotionResponseDto applied=promotionService.applyPromotion(code,totalAmount);
        return ResponseEntity.ok(applied);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<List<PromotionResponseDto>> getAll() {
        return ResponseEntity.ok(promotionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponseDto> getById(@PathVariable int id) {
        return promotionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponseDto> update(@PathVariable int id,
                                                       @RequestBody PromotionDto dto) {
        try {
            return ResponseEntity.ok(promotionService.update(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
