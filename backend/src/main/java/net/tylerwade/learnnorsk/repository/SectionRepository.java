package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.section.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {

    @Query("SELECT s FROM Section s ORDER BY s.sectionNumber ASC")
    public List<Section> findAllOrderBySectionNumberAsc();
}
