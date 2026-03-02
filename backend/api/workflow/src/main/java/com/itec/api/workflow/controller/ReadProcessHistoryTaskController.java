package com.itec.api.workflow.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/workflow/process/history")
public class ReadProcessHistoryTaskController {

    @PostMapping (value = "/getHistory")
    public void getHistory(HttpServletRequest req) throws IOException {
    }

}

