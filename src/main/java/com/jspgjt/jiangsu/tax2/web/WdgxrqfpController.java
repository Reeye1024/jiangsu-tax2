package com.jspgjt.jiangsu.tax2.web;

import com.jspgjt.jiangsu.tax2.entity.Wdgxrqfp;
import com.jspgjt.jiangsu.tax2.repository.WdgxrqfpRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Reeye on 2020/6/6 01:01
 * Nothing is true but improving yourself.
 */
@SuppressWarnings("SpringJavaAutowiredFieldsWarningInspection")
@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/wdgxrqfp")
public class WdgxrqfpController {

    @Autowired
    private WdgxrqfpRepo repo;

    @PostMapping("/batchSave")
    public Map<String, Object> batchSave(@RequestParam String nsrmc, @RequestBody List<String[]> aaData) {
        Map<String, Object> result = new HashMap<>();
        int count = 0;
        for (String[] arr : aaData) {
            Wdgxrqfp fp = new Wdgxrqfp()
                    .setGrabTime(new Date())
                    .setFpdm(arr[1])
                    .setFphm(arr[2])
                    .setKprq(arr[3])
                    .setXfmc(arr[4])
                    .setJe(arr[5])
                    .setSe(arr[6])
                    .setFplx(arr[7])
                    .setFpzt(arr[8])
                    .setGlzt(arr[9]);
            int res = 0;
            try {
                fp.setGhdw(URLDecoder.decode(nsrmc, "UTF-8"));
                res = repo.saveOne(fp);
            } catch (Exception ignored) {}
            count += res;
        }
        result.put("count", count);
        return result;
    }


}
