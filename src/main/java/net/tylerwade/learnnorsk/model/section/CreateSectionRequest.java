package net.tylerwade.learnnorsk.model.section;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CreateSectionRequest extends Section {
    private int[] lessonIds;
}
