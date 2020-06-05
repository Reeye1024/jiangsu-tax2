package com.jspgjt.jiangsu.tax2.repository;

import com.jspgjt.jiangsu.tax2.entity.FpId;
import com.jspgjt.jiangsu.tax2.entity.Wdgxrqfp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by reeye on 2019-11-10 16:10
 * Nothing is true but improving yourself.
 */
@Repository
public interface WdgxrqfpRepo extends JpaRepository<Wdgxrqfp, FpId> {

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query(value = "INSERT INTO fp_wdgxrqfp(fpdm, fphm, kprq, xfmc, je, se, fplx, fpzt, glzt, grab_time, ghdw) VALUES " +
            "(:#{#e.fpdm}, :#{#e.fphm}, :#{#e.kprq}, :#{#e.xfmc}, :#{#e.je}, :#{#e.se}, :#{#e.fplx}, :#{#e.fpzt}, :#{#e.glzt}, GETDATE(), :#{#e.ghdw})", nativeQuery = true)
    int saveOne(@Param("e") Wdgxrqfp e);

}
