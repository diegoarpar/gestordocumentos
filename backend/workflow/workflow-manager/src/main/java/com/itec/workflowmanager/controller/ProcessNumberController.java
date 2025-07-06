package com.itec.workflowmanager.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/workflowmanager/numberService/")
public class ProcessNumberController {


    String collectionProcessNumber="processNumber";

    @PostMapping(value = "/getProcessNumber")
    public void getProcessNumber(HttpServletRequest req) throws IOException {
    }


}

