package com.jspgjt.jiangsu.tax2.repository;

import com.jspgjt.jiangsu.tax2.entity.FpId;
import com.jspgjt.jiangsu.tax2.entity.Fpdk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by reeye on 2019-11-10 16:10
 * Nothing is true but improving yourself.
 */
@Repository
public interface FpdkRepo extends JpaRepository<Fpdk, FpId> {

    long countByGhdw(String ghdw);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query(value = "INSERT INTO fp_fpdk(fpdm, fphm, kprq, xfmc, je, se, yxse, fpzt, fplx, xxly, sfgx, gxsj, glzt, nsrsbh, djzt, sfztslqy, ghdw, xfsh, grab_time) " +
            "VALUES (:#{#e.fpdm}, :#{#e.fphm}, :#{#e.kprq}, :#{#e.xfmc}, :#{#e.je}, :#{#e.se}, :#{#e.yxse}, :#{#e.fpzt}, :#{#e.fplx}, " +
            ":#{#e.xxly}, :#{#e.sfgx}, :#{#e.gxsj}, :#{#e.glzt}, :#{#e.nsrsbh}, :#{#e.djzt}, :#{#e.sfztslqy}, :#{#e.ghdw}, :#{#e.xfsh}, GETDATE())", nativeQuery = true)
    int saveOne(@Param("e") Fpdk e);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query(value = "update fp_fpdk set nsrsbh=?1, djzt=?2, sfztslqy=?3 where xfmc=?4", nativeQuery = true)
    int update(String nsrsbh, String djzt, String sfztslqy, String xfmc);

    @Query(value = "select xfmc, xfsh from fp_fpdk where nsrsbh is null and xfsh is not null and xfmc not in (select distinct xfmc from fp_fpdk where nsrsbh is not null)", nativeQuery = true)
    List<String[]> selectNullXfmc();

    @Query(value = "select xfmc, xfsh " +
            "from fp_fpdk " +
            "where xfmc not in ( " +
            "  select distinct xfmc " +
            "  from fp_fpdk " +
            "  where nsrsbh is not null  " +
            ") and xfmc in :mcs", nativeQuery = true)
    List<String[]> queryXfmcAndXfsh(@Param("mcs") List<String> mcs);

}
