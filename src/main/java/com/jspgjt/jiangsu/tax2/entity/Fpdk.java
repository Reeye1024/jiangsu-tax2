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
@Table(name = "fp_fpdk")
@IdClass(FpId.class)
public class Fpdk {

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
     * 有效税额
     */
    private String yxse;

    /**
     * 发票状态
     */
    private String fpzt;

    /**
     * 发票类型
     */
    private String fplx;

    /**
     * 信息来源
     */
    private String xxly;

    /**
     * 是否勾选
     */
    private String sfgx;

    /**
     * 勾选时间
     */
    private String gxsj;

    /**
     * 管理状态
     */
    private String glzt;

    /**
     * 纳税人识别号
     */
    private String nsrsbh;

    /**
     * 登记状态
     */
    private String djzt;

    /**
     * 是否走逃失联企业
     */
    private String sfztslqy;

    /**
     * 购货单位
     */
    private String ghdw;

    /**
     * 抓取时间
     */
    @Column(name = "grab_time")
    private Date grabTime;

    private String xfsh;
}
