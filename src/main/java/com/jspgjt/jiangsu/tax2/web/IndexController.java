package com.jspgjt.jiangsu.tax2.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Reeye on 2020/4/14 16:18
 * Nothing is true but improving yourself.
 */
@Controller
@CrossOrigin
@RequestMapping("/")
public class IndexController {

    @ResponseBody
    @RequestMapping
    public String hello() {
        return "hello world, this is jiangsu-tax2";
    }

}
