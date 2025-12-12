package com.sysaccessos.backend.ai;

import com.sysaccessos.backend.ai.dto.AreaRecommendationDto;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    public List<AreaRecommendationDto> recommend(@RequestParam("cardIdentifier") String cardIdentifier) {
        return recommendationService.recommendAreas(cardIdentifier);
    }
}
