package net.tylerwade.learnnorsk.repository;

import net.tylerwade.learnnorsk.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    public Optional<Word> findByNorskIgnoreCase(String norsk);

    public Optional<Word> findByEngIgnoreCase(String eng);
}
