package com.consult.backend.Controller;

import com.consult.backend.dto.FormTemplateResponseDto;
import com.consult.backend.service.FormTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class FormTemplateController {

    private final FormTemplateService formServiceTemplate;


   @GetMapping("/{categoryId}/form")
   public FormTemplateResponseDto getFormTemplate(
            @PathVariable Long categoryId
    ){
       return formServiceTemplate.getTemplateByCategory(categoryId);
    }
}
