package net.tylerwade.learnnorsk.model.word;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity @Getter @Setter @NoArgsConstructor @ToString
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "word_seq")
    @SequenceGenerator(name = "word_seq", sequenceName = "word_seq", allocationSize = 1)
    private Long id;

    private String norsk;
    private String eng;
    private String image;
}
