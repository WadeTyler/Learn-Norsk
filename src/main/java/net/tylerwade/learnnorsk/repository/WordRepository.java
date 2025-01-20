package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    public Optional<Word> findByNorskIgnoreCase(String norsk);

    public Optional<Word> findByEngIgnoreCase(String eng);

    public List<Word> findByNorskIgnoreCaseContainingOrEngIgnoreCaseContaining(String norsk, String eng);

    public long count();
}
