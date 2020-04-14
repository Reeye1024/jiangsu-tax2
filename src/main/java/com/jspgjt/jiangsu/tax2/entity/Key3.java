package com.jspgjt.jiangsu.tax2.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Created by Reeye on 2020/3/31 15:15
 * Nothing is true but improving yourself.
 */
@Data
public class Key3 {

    private List<String[]> aaData;
    @JsonProperty("iTotalDisplayRecords")
    private int iTotalDisplayRecords;
    @JsonProperty("iTotalRecords")
    private int iTotalRecords;
    @JsonProperty("sEcho")
    private int sEcho;

}
