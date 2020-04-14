package com.jspgjt.jiangsu.tax2;

import com.jspgjt.jiangsu.tax2.entity.Fpdk;
import com.jspgjt.jiangsu.tax2.repository.FpdkRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

//@SpringBootTest
class JiangsuTax2ApplicationTests {

    @Autowired
    private FpdkRepo fpdkRepo;

    @Rollback(false)
    @Transactional
    @Test
    void contextLoads() {
//        System.err.println(fpdkRepo.selectXfshByExtraIsNull());
        Matcher m = Pattern.compile("'((\\w|%)+3D)'").matcher("<a onclick=cxFpmx('1300193130','18398677','2020-04-14','01','%2FwPF1QK41qVVnX4aJdrf64XiLNG9CY8Azc5shFmp8x4%3D','清河县昌荣金属贸易有限公司','0'); href='javascript:void(0);'><font color=red>查看明细信息</a>");
        if (m.find()) {
            System.out.println(m.groupCount());
            String xfsh = m.group(1);
            System.out.println(xfsh);
        }
//        Fpdk e = new Fpdk().setFpdm("123").setFphm("456");
//        System.out.println(fpdkRepo.saveOne(e));
    }

}
