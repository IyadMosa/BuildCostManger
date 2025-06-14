package com.iyad.bcm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactAppController {
    @RequestMapping(value = {"/", "/{x:[\\w\\-]+}", "/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}"})
    public String forward() {
        return "forward:/index.html";
    }
}