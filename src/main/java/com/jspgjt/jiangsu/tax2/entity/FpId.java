package com.jspgjt.jiangsu.tax2.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * Created by reeye on 2019-11-10 16:08
 * Nothing is true but improving yourself.
 */
@Data
public class FpId implements Serializable {

    /**
     * 发票代码
     */
    private String fpdm;

    /**
     * 发票号码
     */
    private String fphm;

    public FpId() {
    }

    public FpId(String fpdm, String fphm) {
        this.fpdm = fpdm;
        this.fphm = fphm;
    }

}
