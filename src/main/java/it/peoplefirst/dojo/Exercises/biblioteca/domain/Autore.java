package it.peoplefirst.dojo.Exercises.biblioteca.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Autore {
    @Id
    private String id;
    private String nome;
    private String biografia;

}
