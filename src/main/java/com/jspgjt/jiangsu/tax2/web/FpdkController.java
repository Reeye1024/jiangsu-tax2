package com.jspgjt.jiangsu.tax2.web;

import com.jspgjt.jiangsu.tax2.entity.Fpdk;
import com.jspgjt.jiangsu.tax2.entity.Key3;
import com.jspgjt.jiangsu.tax2.repository.FpdkRepo;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Reeye on 2020/4/14 16:01
 * Nothing is true but improving yourself.
 */
@SuppressWarnings("SpringJavaAutowiredFieldsWarningInspection")
@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/fpdk")
public class FpdkController {

    final Pattern pattern = Pattern.compile("'((\\w|%)+3D)'");

    @Autowired
    private FpdkRepo fpdkRepo;

    @PostMapping("/batchSave")
    public Map<String, Object> batchSave(@RequestParam String nsrmc, @RequestBody Key3 key3) {
        Map<String, Object> result = new HashMap<>();
        List<Fpdk> list = new ArrayList<>();
        for (String[] arr : key3.getAaData()) {
            Fpdk fpdk = new Fpdk()
                    .setGrabTime(new Date())
                    .setFpdm(arr[1])
                    .setFphm(arr[2])
                    .setKprq(arr[3])
                    .setXfmc(arr[4])
                    .setJe(arr[5])
                    .setSe(arr[6])
                    .setYxse(arr[7].substring(arr[7].indexOf("=") + 1))
                    .setFpzt(fpzt(arr[8]))
                    .setFplx(fplx(arr[9]))
                    .setXxly(xxly(arr[10]))
                    .setSfgx("0".equals(arr[11]) ? "否" : "是")
                    .setGxsj(arr[12])
                    .setGlzt(glzt(arr[13]));
            Matcher m = pattern.matcher(arr[14]);
            if (m.find() && m.groupCount() == 2) {
                String xfsh = m.group(1);
                fpdk.setXfsh(xfsh);
            }
            try {
                fpdk.setGhdw(URLDecoder.decode(nsrmc, "UTF-8"));
            } catch (UnsupportedEncodingException ignored) {}
            list.add(fpdk);
        }
        if (list.isEmpty()) {
            log.error("empty list~~");
            result.put("saveCount", 0);
        } else {
            int saveCount = 0;
            for (Fpdk fpdk : list) {
                try {
                    saveCount += fpdkRepo.saveOne(fpdk);
                } catch (ConstraintViolationException ignored){
                } catch (Exception e) {
                    log.error("save exception: " + e.getMessage());
                }
            }
            List<String> xfshs = fpdkRepo.selectXfshByExtraIsNull();
            result.put("xfshs", xfshs);
            result.put("saveCount", saveCount);
        }
        return result;
    }

    @PostMapping("/updateExtra")
    public int updateExtra(@RequestParam String nsrsbh, @RequestParam  String djzt, @RequestParam  String sfztslqy, @RequestParam  String xfsh) {
        return fpdkRepo.update(nsrsbh, djzt, "0".equals(sfztslqy) ? "否" : "是", xfsh);
    }

    private String fpzt(String code) {
        switch (code) {
            case "0":
                return "正常";
            case "1":
                return "已失控";
            case "2":
                return "已作废";
            case "3":
                return "已红冲";
            case "4":
                return "异常";
            case "5":
                return "认证异常";
            default:
                return "-";
        }
    }

    private String fplx(String code) {
        switch (code) {
            case "01":
                return "增值税专用发票";
            case "02":
                return "货运专用发票";
            case "03":
                return "机动车发票";
            case "08":
                return "增值税电子专用发票";
            case "14":
                return "通行费电子发票";
            case "66":
                return "代办退税发票";
            default:
                return "";
        }
    }

    private String xxly(String code) {
        switch (code) {
            case "1":
                return "系统推送";
            case "2":
                return "数据采集";
            case "3":
                return "核查转入";
            default:
                return "-";
        }
    }

    private String glzt(String code) {
        switch (code) {
            case "1":
                return "非正常";
            case "0":
                return "正常";
            default:
                return "-";
        }
    }

}
