package com.jspgjt.jiangsu.tax2.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.util.Date;

/**
 * 发票抵扣
 * Created by reeye on 2019-11-10 12:42
 * Nothing is true but improving yourself.
 */
@Data
@Accessors(chain = true)
@Entity
@Table(name = "fp_wdgxrqfp")
@IdClass(FpId.class)
public class Wdgxrqfp {

    /**
     * 发票代码
     */
    @Id
    private String fpdm;

    /**
     * 发票号码
     */
    @Id
    private String fphm;

    /**
     * 开票日期
     */
    private String kprq;

    /**
     * 销方名称
     */
    private String xfmc;

    /**
     * 金额
     */
    private String je;

    /**
     * 税额
     */
    private String se;

    /**
     * 发票类型
     */
    private String fplx;

    /**
     * 发票状态
     */
    private String fpzt;

    /**
     * 管理状态
     */
    private String glzt;

    /**
     * 抓取时间
     */
    @Column(name = "grab_time")
    private Date grabTime;

    /**
     * 购货单位
     */
    private String ghdw;

}
